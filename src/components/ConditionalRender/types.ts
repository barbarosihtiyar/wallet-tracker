import type { ReactNode } from "react";

export type ConditionalRenderProps = {
  value?: unknown;
  children?: ReactNode;
  predicate?: (value: unknown) => boolean;
};
