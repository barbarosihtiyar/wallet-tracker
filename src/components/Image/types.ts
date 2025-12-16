import { ImgHTMLAttributes } from 'react';

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'srcSet'> {
  name?: string;
  alt: string;
  outLink?: boolean | string;
  type?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg';
  app?: string;
  srcSet?: boolean;
  clickable?: boolean;
  onImageClick?: () => void;
  isLoading?: boolean;
  radius?: number;
  width?: number | string;
  height?: number | string;
}
