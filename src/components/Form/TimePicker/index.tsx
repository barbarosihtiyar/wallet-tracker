import './time-picker.scss';

import type { TimePickerProps as AntTimePickerProps } from 'antd';
import { TimePicker as AntTimePicker } from 'antd';
import React from 'react';

interface TimePickerProps extends Omit<AntTimePickerProps, 'className'> {
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  className = '',
  placeholder = '00:00',
  format = 'HH:mm',
  ...props
}) => {
  return (
    <AntTimePicker
      className={`time-picker ${className}`}
      placeholder={placeholder}
      format={format}
      {...props}
    />
  );
};

export default TimePicker;
