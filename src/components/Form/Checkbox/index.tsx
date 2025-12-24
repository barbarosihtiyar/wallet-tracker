import './checkbox.scss';

import { Checkbox as AntdCheckbox } from 'antd';
import classNames from 'classnames';
import React from 'react';

import type { Props } from './types';

const Checkbox: React.FC<Props> = ({
  text,
  onChange,
  type,
  className,
  disabled,
  ...props
}) => {
  return (
    <div className="checkbox">
      <AntdCheckbox
        className={classNames(
          className,
          disabled && 'checkbox--disabled',
          type && `checkbox--${type}`,
        )}
        onChange={onChange}
        {...props}
      >
        {text ? <span className="checkbox__label">{text}</span> : null}
      </AntdCheckbox>
    </div>
  );
};

export default Checkbox;
