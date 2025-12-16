import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DashboardFilters, DashboardState } from "./types";

const initialFilters: DashboardFilters = {
  search: "",
  status: "all",
  kycStatus: "all",
  isActive: "all",
  page: 1,
  pageSize: 10,
};

const initialState: DashboardState = {
  filters: initialFilters,
  selectedCustomerId: undefined,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilters: (
      state,
      { payload }: PayloadAction<Partial<DashboardFilters>>,
    ) => {
      state.filters = {
        ...state.filters,
        ...payload,
        page: payload.page ?? state.filters.page,
      };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    setSelectedCustomerId: (
      state,
      { payload }: PayloadAction<string | undefined>,
    ) => {
      state.selectedCustomerId = payload;
    },
  },
});

export const { setFilters, resetFilters, setSelectedCustomerId } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
