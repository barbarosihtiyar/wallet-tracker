import './not-found.scss';

import { useTranslation } from 'react-i18next';

import { Button, Icon } from '@/components';
import { Config } from '@/app/router/config';
import { Icons } from '@/shared/constants';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <div className="not-found__icon">
        <Icon name={Icons.WARNING} size={32} />
      </div>
      <h1 className="not-found__title">{t('general.error.title')}</h1>
      <p className="not-found__desc">{t('general.error.desc')}</p>
      <Button
        type="dark"
        onClick={() => (window.location.href = Config.HOMEPAGE)}
        aria-label="back-home"
      >
        {t('ui.button.close')}
      </Button>
    </div>
  );
};

export default NotFound;
