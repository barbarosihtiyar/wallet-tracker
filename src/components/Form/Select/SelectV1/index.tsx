import "./select-v1.scss";

import type { SelectProps } from "antd";
import { Select as AntSelect } from "antd";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ConditionalRender, Icon } from "@/components";
import { Icons } from "@/shared/constants";

type DataItem = {
  value?: string | number;
  id?: string | number;
  label?: React.ReactNode;
  name?: React.ReactNode;
  icon?: React.ReactNode;
  img?: string;
  location?: string;
};

type Props = Omit<SelectProps, "options" | "onChange" | "value"> & {
  image?: boolean;
  data?: DataItem[];
  prefixIcon?: React.ReactNode;
  value?: string | number;
  onChange?: (value: string | number) => void;
  additionalFocusFunc?: () => void;
  label?: React.ReactNode;
  name?: React.ReactNode;
  disabled?: boolean;
  rightIcon?: string;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
};

const SelectV1: React.FC<Props> = ({
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
  allowClear = true,
  ...props
}) => {
  const { Option } = AntSelect;
  const [isSelected, setSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [onFocus, setOnFocus] = useState(false);
  const { t } = useTranslation();

  const selectRef = useRef<HTMLDivElement | null>(null);

  const onChangeFunc = (val: string | number) => {
    onChange?.(val);
    setSelected(true);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const insideSelect = !!selectRef.current?.contains(target);
    const insideDropdown = !!target.closest(".ant-select-dropdown");
    if (!insideSelect && !insideDropdown) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={selectRef}
      className={classNames("select", onFocus && "focus", className, {
        "select--image": image,
        "select--disabled": disabled,
      })}
      onMouseDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsOpen(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsOpen(false);
      }}
    >
      {(label || name) && <label>{label || name}</label>}

      {prefixIcon && <div className="select__prefix-icon">{prefixIcon}</div>}

      <AntSelect
        onBlur={() => setOnFocus(false)}
        onFocus={() => {
          setOnFocus(true);
          additionalFocusFunc?.();
        }}
        open={isOpen}
        onChange={onChangeFunc}
        value={value}
        disabled={disabled}
        placeholder={placeholder || (t("ui.placeholder.select") as string)}
        allowClear={allowClear}
        {...props}
      >
        {!!data?.length &&
          data.map((item, index) => (
            <Option
              key={index}
              value={
                item?.value !== undefined ? item.value : (item?.id as unknown)
              }
            >
              <ConditionalRender value={(!!item.icon || !!item.img) && !!image}>
                {item.icon ? (
                  <figure className="select--icon-box">{item.icon}</figure>
                ) : (
                  <figure className="select--image__el">
                    <img src={item.img as string} alt="select-image" />
                  </figure>
                )}
              </ConditionalRender>

              {item?.label || item?.name}

              <ConditionalRender value={!!item.location}>
                <div className="location">
                  <Icon name="point-full" />
                  <span>{item.location}</span>
                </div>
              </ConditionalRender>

              <ConditionalRender value={!!rightIcon}>
                <div className="select__right-icon">
                  <Icon name={rightIcon as string} />
                </div>
              </ConditionalRender>
            </Option>
          ))}
      </AntSelect>

      <div
        className={classNames("select__arrow", {
          selected: isSelected || !!value,
        })}
      >
        <Icon name={Icons.ARROW_DOWN} />
      </div>
    </div>
  );
};

Object.assign(SelectV1, { Option: AntSelect.Option });

export default SelectV1;
