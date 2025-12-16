import { Rule } from 'antd/es/form';
import { TFunction } from 'i18next';

export const getRequiredRule = (
  t: TFunction,
  key: string = 'required.title',
): Rule[] => [
  {
    required: true,
    message: t(`ui.validation.${key}`),
  },
];
