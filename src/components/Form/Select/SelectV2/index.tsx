import './select-v2.scss';

import type { InputRef, SelectProps } from 'antd';
import { Input, Select as AntSelect } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConditionalRender, Icon } from '@/components';
import { Icons } from '@/shared/constants';

type DataItem = {
  value?: string | number;
  id?: string | number;
  label?: React.ReactNode;
  name?: React.ReactNode;
  icon?: React.ReactNode;
  img?: string;
  location?: string;
};

type SelectPrimitive = string | number;
type SelectArrayValue = (string | number)[];
type SelectV2Value = SelectPrimitive | SelectArrayValue;
type SelectV2OnChange =
  | ((value: SelectPrimitive) => void)
  | ((value: SelectV2Value) => void);

type Props = Omit<SelectProps, 'options' | 'onChange' | 'value'> & {
  image?: boolean;
  data?: DataItem[];
  prefixIcon?: React.ReactNode;
  value?: SelectV2Value;
  onChange?: SelectV2OnChange;
  additionalFocusFunc?: () => void;
  label?: React.ReactNode;
  name?: React.ReactNode;
  disabled?: boolean;
  rightIcon?: string;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  allowClear?: boolean;
};

const SelectV2: React.FC<Props> = ({
  image,
  data,
  prefixIcon,
  value,
  onChange,
  additionalFocusFunc,
  label,
  name,
  disabled,
  rightIcon,
  placeholder,
  className,
  searchPlaceholder,
  allowClear = true,
  ...props
}) => {
  const { Option } = AntSelect;
  const [isSelected, setSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [onFocus, setOnFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const selectRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<InputRef | null>(null);

  const onChangeFunc = (val: SelectV2Value) => {
    (onChange as ((value: SelectV2Value) => void) | undefined)?.(val);
    setSelected(true);
    setIsOpen(false);
    setSearchValue('');
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const insideSelect = !!selectRef.current?.contains(target);

    const insideDropdown = !!target.closest('.ant-select-dropdown');

    if (!insideSelect && !insideDropdown) {
      setIsOpen(false);
      setSearchValue('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  const normalizeText = (text: string) => {
    return text.toLocaleLowerCase('tr');
  };

  const filteredData = data?.filter(item => {
    if (!searchValue) return true;
    const itemLabel = normalizeText(String(item?.label || item?.name || ''));
    const searchTerm = normalizeText(searchValue);
    return itemLabel.includes(searchTerm);
  });

  return (
    <div
      ref={selectRef}
      className={classNames('select-v2', onFocus && 'focus', className, {
        'select-v2--image': image,
        'select-v2--disabled': disabled,
      })}
      onKeyDownCapture={e => {
        if (
          (e.key === 'Backspace' || e.key === 'Delete') &&
          props.mode === 'multiple'
        ) {
          const target = e.target as HTMLElement;
          if (target.closest('.select-v2__search')) {
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation?.();
          }
        }
      }}
    >
      {(label || name) && <label>{label || name}</label>}

      {prefixIcon && <div className="select-v2__prefix-icon">{prefixIcon}</div>}

      <div
        className="select-v2__trigger"
        onMouseDown={e => {
          if (disabled) return;
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <AntSelect
          {...props}
          showSearch={false}
          defaultActiveFirstOption={false}
          onBlur={() => setOnFocus(false)}
          onFocus={() => {
            setOnFocus(true);
            additionalFocusFunc?.();
          }}
          open={isOpen}
          onChange={onChangeFunc}
          value={value}
          disabled={disabled}
          placeholder={placeholder || (t('ui.placeholder.select') as string)}
          maxTagCount="responsive"
          notFoundContent={t('general.noData')}
          allowClear={allowClear}
          onInputKeyDown={e => {
            if (
              (e.key === 'Backspace' || e.key === 'Delete') &&
              props.mode === 'multiple'
            ) {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation?.();
            }
          }}
          dropdownRender={menu => (
            <>
              <div className="select-v2__search">
                <Icon name={Icons.SEARCH} />
                <Input
                  ref={searchInputRef}
                  placeholder={
                    searchPlaceholder || (t('ui.placeholder.search') as string)
                  }
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.stopPropagation();
                      e.nativeEvent?.stopImmediatePropagation?.();
                    }
                  }}
                />
              </div>
              {menu}
            </>
          )}
        >
          {!!filteredData?.length &&
            filteredData.map((item, index) => (
              <Option
                key={index}
                value={item?.value !== undefined ? item.value : item?.id}
              >
                <ConditionalRender value={!!item.icon || !!item.img}>
                  <Icon name={item.icon as string} />
                </ConditionalRender>

                {item?.label || item?.name}

                <ConditionalRender value={!!item.location}>
                  <div className="location">
                    <Icon name="point-full" />
                    <span>{item.location}</span>
                  </div>
                </ConditionalRender>

                <ConditionalRender value={!!rightIcon}>
                  <div className="select-v2__right-icon">
                    <Icon name={rightIcon as string} />
                  </div>
                </ConditionalRender>
              </Option>
            ))}
        </AntSelect>
      </div>

      <div
        className={classNames('select-v2__arrow', {
          selected: isSelected || !!value,
        })}
      >
        <Icon name={Icons.ARROW_DOWN} />
      </div>
    </div>
  );
};

Object.assign(SelectV2, { Option: AntSelect.Option });

export default SelectV2;
