import './custom-modal.scss';

import React, { useEffect, useState } from 'react';

import { Config } from '@/app/router/config';
import { Button } from '@/components';

import { CustomModalProps } from './types';

/**
 * Unified Custom Modal component
 * Replaces CustomModalV1 and CustomModalV2
 */
const CustomModal: React.FC<CustomModalProps> = ({
  isOpen = false,
  title,
  description,
  text,
  buttonText,
  Icon,
  onClose,
  onClick,
  width = 400,
  showOnce = false,
  sessionKey = 'hasShownModal',
}) => {
  const [open, setOpen] = useState(false);

  const isHomePage =
    window.location.pathname === Config.HOMEPAGE ||
    window.location.pathname === Config.LOGIN;

  const checkSessionStorage = () => {
    if (!showOnce) return true;
    if (!isHomePage) return false;
    return !sessionStorage.getItem(sessionKey);
  };

  useEffect(() => {
    if (isOpen && checkSessionStorage()) {
      setOpen(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (showOnce && isHomePage) {
      sessionStorage.setItem(sessionKey, 'true');
    }
    setOpen(false);
    onClose?.();
  };

  const handleClick = () => {
    onClick?.();
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="customModal">
      <div className="customModal__overlay" onClick={handleClose} />
      <div className="customModal__content" style={{ width: `${width}px` }}>
        <button className="customModal__close" onClick={handleClose}>
          &#215;
        </button>

        {Icon && <div className="customModal__icon">{Icon}</div>}

        {title && <h2 className="customModal__title">{title}</h2>}

        {description && (
          <p className="customModal__description">{description}</p>
        )}

        {text && <p className="customModal__text">{text}</p>}

        {buttonText && (
          <Button
            className="customModal__button"
            onClick={handleClick}
            type="primary"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
