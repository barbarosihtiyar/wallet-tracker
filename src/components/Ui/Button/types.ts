import { ReactElement, ReactNode } from 'react';

export type ButtonType =
  | 'basic'
  | 'light'
  | 'dark'
  | 'grey'
  | 'warning'
  | string;
export type ButtonSize = 'basic' | 'small' | 'big' | string;
export type CompType = 'button' | 'nav' | 'disabled' | string;

export type Props = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  htmlType?: 'button' | 'submit' | 'reset';
  className?: string;
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  iconOnly?: ReactElement;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  compType?: CompType;
  children?: ReactNode;
  isLoading?: boolean;
  loaderTheme?: 'light' | 'dark';
};
