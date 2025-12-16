import { SelectProps } from "antd";

export type DataItem = {
  value?: string | number;
  id?: string | number;
  label?: React.ReactNode;
  name?: React.ReactNode;
  icon?: React.ReactNode;
  img?: string;
  location?: string;
};

export type SelectPrimitive = string | number;
export type SelectArrayValue = (string | number)[];
export type SelectV3Value = SelectPrimitive | SelectArrayValue;
export type SelectV3OnChange =
  | ((value: SelectPrimitive) => void)
  | ((value: SelectV3Value) => void);

export type SelectV3Props = Omit<
  SelectProps,
  "options" | "onChange" | "value"
> & {
  image?: boolean;
  data?: DataItem[];
  prefixIcon?: React.ReactNode;
  value?: SelectV3Value;
  onChange?: SelectV3OnChange;
  additionalFocusFunc?: () => void;
  label?: React.ReactNode;
  name?: React.ReactNode;
  disabled?: boolean;
  rightIcon?: string;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
};
