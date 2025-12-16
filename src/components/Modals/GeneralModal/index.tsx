import './general-modal.scss';

import { Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Config } from '@/app/router/config';
import { Button, ConditionalRender, Icon } from '@/components';
import { clearGeneralModal } from '@/redux/slices/Notifications/slice';
import { RootState } from '@/redux/store';
import { Icons } from '@/shared/constants';
import { useAppSelector } from '@/shared/hooks';

import { Props } from './types';

const GeneralModal: React.FC<Props> = ({
  buttonCount = 1,
  oneButtonType = 'light',
  maskClosable = true,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { generalModal } = useAppSelector(
    (state: RootState) => state.notifications
  );

  const isHomePage = window.location.pathname === Config.HOMEPAGE;
  const SESSION_KEY = 'hasShownRestrictedModal';

  const markModalAsShown = () => {
    if (isHomePage) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  };

  const shouldShowModal = () => {
    const isNormalModal = !isHomePage || !generalModal.display;
    if (isNormalModal) return generalModal.display;

    const hasBeenShown = sessionStorage.getItem(SESSION_KEY) === 'true';
    return !hasBeenShown;
  };

  const closeModal = () => {
    markModalAsShown();
    /*  window.location.href = '/'; */
    dispatch(clearGeneralModal());
  };

  return (
    <Modal
      open={shouldShowModal()}
      className={classNames('general-modal')}
      closeIcon={<Icon name={Icons.CLOSE} />}
      centered
      maskClosable={maskClosable}
      onCancel={closeModal}
      footer={
        <div className="action-group">
          <ConditionalRender value={buttonCount === 1}>
            <Button type={oneButtonType} onClick={closeModal}>
              {t('ui.button.close')}
            </Button>
          </ConditionalRender>
        </div>
      }
      width={'400px'}
    >
      <div className="modal__body">
        <ConditionalRender value={generalModal?.type}>
          <Icon size={50} name={generalModal?.type as string} />
        </ConditionalRender>

        <ConditionalRender value={generalModal?.title || generalModal?.message}>
          <div className="modal__body__text">
            <ConditionalRender value={generalModal?.title}>
              <span className="modal__body__text--title">
                {generalModal?.title}
              </span>
            </ConditionalRender>
            <ConditionalRender value={generalModal?.message}>
              <span className="modal__body__text--message">
                {generalModal?.message}
              </span>
            </ConditionalRender>
          </div>
        </ConditionalRender>
      </div>
    </Modal>
  );
};

export default GeneralModal;
