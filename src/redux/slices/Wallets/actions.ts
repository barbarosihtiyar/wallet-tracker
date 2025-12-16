import { createAsyncThunk } from "@reduxjs/toolkit";
import { get, patch } from "@/shared/services/request";
import type { Wallet, UpdateWalletLimitsPayload } from "./types";

export const fetchWalletByCustomerId = createAsyncThunk<Wallet, string>(
  "wallets/fetchByCustomerId",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await get(`/wallets/${customerId}`);
      return response?.data as Wallet;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch wallet");
    }
  },
);

export const updateWalletLimits = createAsyncThunk<
  Wallet,
  { customerId: string; payload: UpdateWalletLimitsPayload }
>(
  "wallets/updateLimits",
  async ({ customerId, payload }, { rejectWithValue }) => {
    try {
      const response = await patch(`/wallets/${customerId}`, payload);
      return response?.data as Wallet;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update wallet limits");
    }
  },
);
