import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AntNotificationsState, NotificationType } from './types';

const initialState: AntNotificationsState = {
  antNotificationsList: [],
  generalModal: {
    id: Date.now(),
    title: '',
    message: '',
    type: '',
    display: false,
  },
};

export const notifications = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (
      state,
      {
        payload,
      }: PayloadAction<{
        title?: string;
        message: string;
        type: NotificationType;
      }>,
    ) => {
      state.antNotificationsList.push({
        id: Date.now(),
        title: payload.title || '',
        message: payload.message,
        type: payload.type,
      });
    },
    removeNotificationData: (state, { payload }: PayloadAction<number>) => {
      state.antNotificationsList = state.antNotificationsList.filter(
        item => item.id !== payload,
      );
    },
    showGeneralModal: (
      state,
      {
        payload,
      }: PayloadAction<{
        title: string | null;
        message: string;
        type: NotificationType;
      }>,
    ) => {
      state.generalModal = {
        id: Date.now(),
        title: payload.title ? payload.title : '',
        message: payload.message,
        type: payload.type,
        display: true,
      };
    },
    clearGeneralModal: state => {
      state.generalModal = initialState.generalModal;
    },
  },
});

export const {
  showNotification,
  removeNotificationData,
  showGeneralModal,
  clearGeneralModal,
} = notifications.actions;

export default notifications.reducer;
