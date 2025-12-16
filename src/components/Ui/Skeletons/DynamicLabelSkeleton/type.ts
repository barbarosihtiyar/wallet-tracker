import { DynamicLabelType } from '@/shared/constants';

export type DynamicLabelSkeletonProps = {
  width?: number | string;
  isLoading?: boolean;
  type?: DynamicLabelType;
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'default' | 'large';
};
