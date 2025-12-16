import React from "react";

import type { IconName } from "./registry";

/**
 * Icon component props
 */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon name from the registry */
  name: IconName;
  /** Optional size (applies to both width and height) */
  size?: number | string;
}
