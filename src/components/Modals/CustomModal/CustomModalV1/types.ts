export type ButtonStyle = "light" | "dark" | string;

import React from "react";

export type CustomModalV1Props = {
  buttonCount?: number;
  showModal: boolean;
  oneButtonType?: ButtonStyle;
  maskClosable?: boolean;
  children?: React.ReactNode;
  customFooter?: React.ReactNode;
  onClose?: () => void;
  icon?: string;
  title?: string;
  className?: string;
  text?: string;
};
