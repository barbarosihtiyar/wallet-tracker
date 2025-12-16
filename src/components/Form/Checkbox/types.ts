import type { CheckboxProps } from "antd";
import type { ReactNode } from "react";

export type Props = Omit<CheckboxProps, "children" | "onChange"> & {
  text?: ReactNode;
  onChange?: CheckboxProps["onChange"];
};
