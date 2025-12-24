import type { SerializedError } from '@reduxjs/toolkit';

import i18n from '@/shared/i18n';

type RejectedAction = {
  payload?: unknown;
  error?: SerializedError;
};

export const getErrorMessage = (action: RejectedAction): string => {
  if (typeof action.payload === 'string' && action.payload)
    return action.payload;
  return action.error?.message ?? i18n.t('general.error.desc');
};
