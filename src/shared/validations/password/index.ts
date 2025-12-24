import { Rule } from 'antd/es/form';
import { TFunction } from 'i18next';

const PASSWORD_MIN = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;

export const getPasswordRules = (t: TFunction): Rule[] => [
  {
    required: true,
    message: t('ui.validation.password.required'),
  },
  {
    validator: async (_: Rule, value: unknown) => {
      if (typeof value !== 'string' || value.length === 0) {
        return Promise.resolve();
      }

      if (value.length < PASSWORD_MIN) {
        return Promise.reject(new Error(t('ui.validation.password.minLength')));
      }

      if (!PASSWORD_REGEX.test(value)) {
        return Promise.reject(new Error(t('ui.validation.password.pattern')));
      }

      return Promise.resolve();
    },
  },
];
