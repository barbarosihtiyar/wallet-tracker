export type LoaderProps = {
  fullScreen?: boolean;
  type?: 'xs' | 'sm' | 'md' | 'lg';
  flex?: 'center' | 'start' | 'end';
  theme?: 'light' | 'dark';
};

export type LoaderStyle = React.CSSProperties & {
  '--loader-size'?: string;
};
