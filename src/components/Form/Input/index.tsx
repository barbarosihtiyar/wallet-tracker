import './input.scss';

import { Input as AntdInput } from 'antd';
import type { InputProps as AntdInputProps, InputRef } from 'antd/es/input';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { ConditionalRender, Icon } from '@/components';

import { Props } from './types';

const Input: React.FC<Props> & { Special: React.FC<SpecialProps> } = ({
  inputType = 'text',
  compType,
  borderType,
  compClassName,
  label,
  leftLabel,
  iconLeft,
  iconRight,
  disabled,
  separator,
  image,
  onRightIconClick,
  suffix,
  className,
  onPressEnter,
  allowClear = true,
  ...props
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={classNames(
        'input',
        compClassName,
        className,
        focus && 'focus',
        {
          'input--icon-left': !!iconLeft,
          'input--icon-right': !!iconRight,
          'input--text': inputType === 'text',
          'input--email': inputType === 'email',
          'input--password': inputType === 'password',
          'input--number': inputType === 'number',
          'input--dark': compType === 'dark',
          'input--light': compType === 'light',
          'input--rounded': borderType === 'rounded',
          'input--disabled': !!disabled,
        },
      )}
    >
      <ConditionalRender value={!!label}>
        <label className="input__label">{label}</label>
      </ConditionalRender>

      <div className="input__content">
        <ConditionalRender value={!!iconLeft || !!leftLabel}>
          <div className={classNames('input__content__left', { separator })}>
            <ConditionalRender value={!!iconLeft}>
              <div className="input__content__left--icon">
                {iconLeft ? <Icon name={iconLeft} /> : null}
              </div>
            </ConditionalRender>
            <ConditionalRender value={!!leftLabel}>
              <div className="input__content__left--label">{leftLabel}</div>
            </ConditionalRender>
          </div>
        </ConditionalRender>

        <AntdInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          suffix={suffix}
          onPressEnter={onPressEnter}
          disabled={disabled}
          allowClear={allowClear}
          onKeyPress={e => {
            if (inputType === 'number' && !/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }}
          type={inputType}
          autoComplete="off"
          {...props}
        />

        <ConditionalRender value={!!iconRight}>
          <button
            className="input__content__right-icon"
            type="button"
            onClick={onRightIconClick}
          >
            {iconRight ? <Icon name={iconRight} /> : null}
          </button>
        </ConditionalRender>

        {image}
      </div>
    </div>
  );
};

/* -------- Special sub-component -------- */

type SpecialProps = Omit<AntdInputProps, 'type' | 'value' | 'onChange'> & {
  inputType: 'password' | 'search' | string;
  compType?: 'dark' | 'light' | string;
  disabled?: boolean;
  leftLabel?: React.ReactNode;
  iconLeft?: string;
  label?: string;
  separator?: boolean;
  value?: string;
  initialValue?: string;
  allowClear?: boolean;
  onChange: (v: string) => void;
};

const Special: React.FC<SpecialProps> = ({
  inputType,
  compType,
  disabled,
  leftLabel,
  iconLeft,
  label,
  separator,
  value,
  onChange,
  initialValue,
  className,
  allowClear = true,
  ...props
}) => {
  const element = useRef<InputRef>(null);
  const [typeControl, setTypeControl] = useState(false);
  const [focus, setFocus] = useState(false);

  const toggle = () => setTypeControl(v => !v);
  const deleteSearchArea = () => onChange('');

  useEffect(() => {
    if (inputType === 'password') {
      if (typeControl) {
        if (element.current?.input) element.current.input.type = 'text';
      } else {
        if (element.current?.input) element.current.input.type = 'password';
      }
    }
  }, [typeControl, inputType]);

  return (
    <div
      className={classNames(
        'input',
        'input--icon-left',
        'input--icon-right',
        focus && 'focus',
        className,
        {
          'input--password': inputType === 'password',
          'input--search': inputType === 'search',
          'input--dark': compType === 'dark',
          'input--light': compType === 'light',
          'input--disabled': !!disabled,
        },
      )}
    >
      {label && <label className="input__label">{label}</label>}

      <div className="input__content">
        {!iconLeft && (
          <div className={classNames('input__content__left', { separator })}>
            <div className="input__content__left--icon">
              <Icon
                name={
                  inputType === 'password'
                    ? 'lock-single-dot'
                    : inputType === 'search'
                      ? 'search'
                      : ''
                }
              />
            </div>
            {leftLabel && (
              <div className="input__content__left--label">{leftLabel}</div>
            )}
          </div>
        )}

        <AntdInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          allowClear={allowClear}
          value={initialValue ?? value}
          onChange={e => onChange(e.target.value)}
          className={`input-${inputType}`}
          ref={element}
          type={inputType === 'search' ? 'text' : inputType}
          autoComplete="off"
          {...props}
        />

        {(inputType === 'password' || (inputType === 'search' && !!value)) && (
          <button
            type="button"
            className="input__content__right-icon"
            onClick={inputType === 'password' ? toggle : deleteSearchArea}
          >
            <Icon
              name={
                inputType === 'password' && !typeControl
                  ? 'dont-show'
                  : inputType === 'password' && typeControl
                    ? 'eye-open'
                    : inputType === 'search'
                      ? 'close'
                      : ''
              }
            />
          </button>
        )}
      </div>
    </div>
  );
};

Input.Special = Special;

export default Input;
