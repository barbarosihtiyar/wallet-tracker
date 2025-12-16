import type { Dispatch, SetStateAction } from "react";

export type Props = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};
