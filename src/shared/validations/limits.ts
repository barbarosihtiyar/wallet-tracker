import { TFunction } from 'i18next';

export const LIMIT_CONSTRAINTS = {
  MIN: 250,
  MAX: 1_000_000,
} as const;

interface LimitValues {
  availableLimit?: number;
  dailyLimit?: number;
}

/**
 * Validates available limit constraints
 */
export const validateAvailableLimit =
  (t: TFunction) =>
  (_: unknown, value: number): Promise<void> => {
    if (!value) {
      return Promise.reject(
        new Error(t('dashboard.forms.limit.fields.availableLimit')),
      );
    }

    if (value < LIMIT_CONSTRAINTS.MIN) {
      return Promise.reject(
        new Error(
          t('dashboard.forms.errors.minLimit', { min: LIMIT_CONSTRAINTS.MIN }),
        ),
      );
    }

    if (value > LIMIT_CONSTRAINTS.MAX) {
      return Promise.reject(
        new Error(
          t('dashboard.forms.errors.maxLimit', { max: LIMIT_CONSTRAINTS.MAX }),
        ),
      );
    }

    return Promise.resolve();
  };

/**
 * Validates daily limit against available limit
 */
export const validateDailyLimit =
  (t: TFunction, getFieldValue: (field: string) => number) =>
  (_: unknown, value: number): Promise<void> => {
    const availableLimit = getFieldValue('availableLimit');

    if (!value) {
      return Promise.reject(
        new Error(t('dashboard.forms.limit.fields.dailyLimit')),
      );
    }

    if (value < LIMIT_CONSTRAINTS.MIN) {
      return Promise.reject(
        new Error(
          t('dashboard.forms.errors.minLimit', { min: LIMIT_CONSTRAINTS.MIN }),
        ),
      );
    }

    if (value > LIMIT_CONSTRAINTS.MAX) {
      return Promise.reject(
        new Error(
          t('dashboard.forms.errors.maxLimit', { max: LIMIT_CONSTRAINTS.MAX }),
        ),
      );
    }

    if (value > availableLimit) {
      return Promise.reject(
        new Error(t('dashboard.forms.errors.dailyExceedsAvailable')),
      );
    }

    return Promise.resolve();
  };

/**
 * Validates both limits at once
 */
export const validateLimits = (
  values: LimitValues,
  t: TFunction,
): { availableLimit?: string; dailyLimit?: string } => {
  const errors: { availableLimit?: string; dailyLimit?: string } = {};

  if (!values.availableLimit) {
    errors.availableLimit = t('dashboard.forms.limit.fields.availableLimit');
  } else if (values.availableLimit < LIMIT_CONSTRAINTS.MIN) {
    errors.availableLimit = t('dashboard.forms.errors.minLimit', {
      min: LIMIT_CONSTRAINTS.MIN,
    });
  } else if (values.availableLimit > LIMIT_CONSTRAINTS.MAX) {
    errors.availableLimit = t('dashboard.forms.errors.maxLimit', {
      max: LIMIT_CONSTRAINTS.MAX,
    });
  }

  if (!values.dailyLimit) {
    errors.dailyLimit = t('dashboard.forms.limit.fields.dailyLimit');
  } else if (values.dailyLimit < LIMIT_CONSTRAINTS.MIN) {
    errors.dailyLimit = t('dashboard.forms.errors.minLimit', {
      min: LIMIT_CONSTRAINTS.MIN,
    });
  } else if (values.dailyLimit > LIMIT_CONSTRAINTS.MAX) {
    errors.dailyLimit = t('dashboard.forms.errors.maxLimit', {
      max: LIMIT_CONSTRAINTS.MAX,
    });
  } else if (
    values.dailyLimit &&
    values.availableLimit &&
    values.dailyLimit > values.availableLimit
  ) {
    errors.dailyLimit = t('dashboard.forms.errors.dailyExceedsAvailable');
  }

  return errors;
};
