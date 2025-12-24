import './custom-modal-v1.scss';

import { Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Config } from '@/app/router/config';
import { Button, ConditionalRender, Icon } from '@/components';
import { Icons } from '@/shared/constants';

import { CustomModalV1Props } from './types';

const CustomModalV1: React.FC<CustomModalV1Props> = ({
  showModal,
  buttonCount = 1,
  oneButtonType = 'basic',
  maskClosable = true,
  children,
  customFooter,
  onClose,
  icon,
  title,
  className,
  text,
}) => {
  const { t } = useTranslation();

  const isHomePage = window.location.pathname === Config.HOMEPAGE;
  const SESSION_KEY = 'hasShownRestrictedModal';

  const markModalAsShown = () => {
    if (isHomePage) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  };

  const closeModal = () => {
    markModalAsShown();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      open={showModal}
      className={classNames('custom-modals-v2', className)}
      closeIcon={<Icon name={Icons.CLOSE} />}
      centered
      maskClosable={maskClosable}
      onCancel={closeModal}
      footer={
        customFooter || (
          <div className="action-group">
            <ConditionalRender value={buttonCount === 1}>
              <Button type={oneButtonType} onClick={closeModal}>
                {t('ui.button.close')}
              </Button>
            </ConditionalRender>
          </div>
        )
      }
      width={'450px'}
    >
      <div className="modal__body">
        <ConditionalRender value={icon || title}>
          <div className="modal__header">
            <ConditionalRender value={icon}>
              <Icon name={icon as string} />
            </ConditionalRender>
            <ConditionalRender value={title}>
              <h3 className="modal__title">{title}</h3>
            </ConditionalRender>
          </div>
        </ConditionalRender>

        {children}
        <ConditionalRender value={text}>
          <p className="modal__text">{text}</p>
        </ConditionalRender>
      </div>
    </Modal>
  );
};

export default CustomModalV1;
