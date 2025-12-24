import { Skeleton } from 'antd';
import React, { JSX } from 'react';

import { DynamicLabelType } from '@/shared/constants';

import { DynamicLabelSkeletonProps } from './type';

const elementMap: Record<DynamicLabelType, keyof JSX.IntrinsicElements> = {
  [DynamicLabelType.Span]: 'span',
  [DynamicLabelType.Paragraph]: 'p',
  [DynamicLabelType.H1]: 'h1',
  [DynamicLabelType.H2]: 'h2',
  [DynamicLabelType.H3]: 'h3',
  [DynamicLabelType.H4]: 'h4',
  [DynamicLabelType.H5]: 'h5',
  [DynamicLabelType.H6]: 'h6',
};

const DynamicLabelSkeleton: React.FC<DynamicLabelSkeletonProps> = ({
  width = '300',
  isLoading = false,
  type = DynamicLabelType.Span,
  children,
  className,
  size,
}) => {
  if (isLoading) {
    return (
      <Skeleton.Input active size={size} style={{ width: `${width}px` }} />
    );
  }

  const Component = elementMap[type] || 'span';

  return <Component className={className}>{children}</Component>;
};

export default DynamicLabelSkeleton;
