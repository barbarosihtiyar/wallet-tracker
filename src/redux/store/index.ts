import { configureStore } from '@reduxjs/toolkit';

import {
  customers,
  dashboard,
  notifications,
  transactions,
  wallets,
} from '../slices';

export const store = configureStore({
  reducer: {
    dashboard,
    notifications,
    customers,
    transactions,
    wallets,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
