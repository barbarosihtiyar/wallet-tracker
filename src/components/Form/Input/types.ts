import type { InputProps as AntdInputProps } from 'antd/es/input';

export type CommonProps = {
  inputType?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'card'
    | 'search'
    | string;
  compType?: 'dark' | 'light' | string;
  borderType?: 'rounded' | string;
  compClassName?: string;

  label?: React.ReactNode;
  leftLabel?: React.ReactNode;

  iconLeft?: string;
  iconRight?: string;

  disabled?: boolean;
  separator?: boolean;
  image?: React.ReactNode;
  allowClear?: boolean;

  onRightIconClick?: () => void;
};

export type Props = CommonProps & AntdInputProps;
