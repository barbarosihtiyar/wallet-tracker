import '@/app/styles/index.scss';
import '@/shared/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import {
  AntNotificationLayout,
  GeneralModal,
  Router,
  SuspenseLayout,
} from '@/components';
import { getCspNonce } from '@/shared/lib';

import { store } from './redux/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const app = document.getElementById('bpn-case-app');
if (app) {
  const root = createRoot(app);
  const cspNonce = getCspNonce();

  root.render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ConfigProvider csp={cspNonce ? { nonce: cspNonce } : undefined}>
          <AntNotificationLayout>
            <SuspenseLayout>
              <Router />
              <GeneralModal />
            </SuspenseLayout>
          </AntNotificationLayout>
        </ConfigProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}
