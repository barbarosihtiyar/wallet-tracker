export type ButtonStyle = "light" | "dark" | string;

export type Props = {
  buttonCount?: number;
  oneButtonType?: ButtonStyle;
  maskClosable?: boolean;
  goRouteName?: string;
};
