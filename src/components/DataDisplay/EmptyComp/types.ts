import { HTMLAttributes, ReactNode } from "react";

export type Props = {
  img?: ReactNode;
  type?: "v2";
  text?: string;
} & HTMLAttributes<HTMLDivElement>;
