import React from 'react';

import { CustomerDetailPage, HomePage, NotFound } from '@/pages';

import { Config } from './config';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  access: boolean;
  suspenseFallback?: boolean;
}

export const routesList: RouteConfig[] = [
  {
    path: Config.HOMEPAGE,
    component: HomePage,
    access: false,
  },
  {
    path: Config.CUSTOMER_DETAIL,
    component: CustomerDetailPage,
    access: false,
  },
  {
    path: Config.NOT_FOUND,
    component: NotFound,
    access: false,
  },
];
