import './button.scss';

import classNames from 'classnames';
import React from 'react';

import Loader from '@/components/Loader';

import { Props } from './types';

const Button: React.FC<Props> = ({
  htmlType = 'button',
  className,
  iconLeft,
  iconOnly,
  iconRight,
  type = 'basic',
  disabled,
  compType = 'button',
  children,
  isLoading = false,
  loaderTheme = 'light',
  ...props
}) => {
  return (
    <button
      aria-label="button"
      type={htmlType}
      disabled={disabled || isLoading}
      className={classNames(
        'button',
        className,
        disabled && 'button--disabled',
        type && `button--${type}`,
        isLoading && 'button--loading',
        {
          'button--left-icon': !!iconLeft && !iconRight && compType !== 'nav',
          'button--right-icon': !!iconRight && !iconLeft,
          'button--only-icon': !!iconOnly,
          'button--nav': compType === 'nav',
          'button--like-disabled': compType === 'disabled',
        },
      )}
      {...props}
    >
      {iconLeft && !isLoading ? <span className="icon">{iconLeft}</span> : null}
      {children && (
        <span className={classNames('text', { 'text--hidden': isLoading })}>
          {children}
        </span>
      )}
      {isLoading && <Loader theme={loaderTheme} />}
      {iconOnly ?? null}
      {iconRight ?? null}
    </button>
  );
};

export default Button;
