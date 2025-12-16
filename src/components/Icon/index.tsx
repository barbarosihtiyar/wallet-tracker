import React from 'react';

import { EnvironmentTypes } from '@/shared/constants';

import { getAvailableIcons, getIconComponent } from './registry';
import type { IconProps } from './types';

const Icon: React.FC<IconProps> = ({ name, size = 16, ...rest }) => {
  const Component = getIconComponent(name);

  if (!Component) {
    if (process.env.NODE_ENV !== EnvironmentTypes.Production) {
      getAvailableIcons();
    }
    return null;
  }

  return <Component width={size} height={size} {...rest} />;
};

export default Icon;
export type { IconProps };
