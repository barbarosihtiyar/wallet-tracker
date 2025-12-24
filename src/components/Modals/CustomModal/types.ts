import { ReactNode } from 'react';

export interface CustomModalProps {
  isOpen?: boolean;
  title?: string;
  description?: string;
  text?: string;
  buttonText?: string;
  Icon?: ReactNode;
  onClose?: () => void;
  onClick?: () => void;
  width?: number;
  showOnce?: boolean;
  sessionKey?: string;
}
