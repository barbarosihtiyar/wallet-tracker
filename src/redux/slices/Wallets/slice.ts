import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WalletsState } from "./types";
import { fetchWalletByCustomerId, updateWalletLimits } from "./actions";

const initialState: WalletsState = {
  wallets: {},
  currentWallet: null,
  loading: {
    fetch: false,
    update: false,
  },
  error: null,
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setCurrentWallet: (state, action: PayloadAction<string | null>) => {
      if (action.payload && state.wallets[action.payload]) {
        state.currentWallet = state.wallets[action.payload];
      } else {
        state.currentWallet = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWallets: (state) => {
      state.wallets = {};
      state.currentWallet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletByCustomerId.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchWalletByCustomerId.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const wallet = action.payload;
        state.wallets[wallet.customerId] = wallet;
        state.currentWallet = wallet;
      })
      .addCase(fetchWalletByCustomerId.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateWalletLimits.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateWalletLimits.fulfilled, (state, action) => {
        state.loading.update = false;
        const wallet = action.payload;
        state.wallets[wallet.customerId] = wallet;
        if (state.currentWallet?.customerId === wallet.customerId) {
          state.currentWallet = wallet;
        }
      })
      .addCase(updateWalletLimits.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentWallet, clearError, clearWallets } =
  walletsSlice.actions;
export default walletsSlice.reducer;
