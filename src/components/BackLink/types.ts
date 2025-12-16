export type Props = {
  text: string;
  className?: string;
  backLinkUrl?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
  isShowCloseIcon?: boolean;
};
