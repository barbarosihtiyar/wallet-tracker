import React, { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { routesList } from '@/app/router';
import { Config } from '@/app/router/config';
import { AppShell, ErrorBoundary, SuspenseLayout } from '@/components';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

type RouteItem = (typeof routesList)[number] & {
  useSuspense?: boolean;
  suspenseFallback?: ReactNode;
};

const Router: React.FC = () => {
  const routes = routesList as RouteItem[];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(route => {
          const Component = route.component;

          const wrapped = route.useSuspense ? (
            <SuspenseLayout fallback={route.suspenseFallback}>
              <Component />
            </SuspenseLayout>
          ) : (
            <Component />
          );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.access ? (
                  <AppShell>
                    <ProtectedRoute>
                      <ErrorBoundary key={route.path}>{wrapped}</ErrorBoundary>
                    </ProtectedRoute>
                  </AppShell>
                ) : (
                  <AppShell>
                    <ErrorBoundary key={route.path}>{wrapped}</ErrorBoundary>
                  </AppShell>
                )
              }
            />
          );
        })}
        <Route path="*" element={<Navigate to={Config.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
