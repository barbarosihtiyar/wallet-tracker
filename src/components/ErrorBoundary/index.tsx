import './error-boundary.scss';

import React, { ReactNode } from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';

import { Button, Icon } from '@/components';
import { Icons } from '@/shared/constants';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    /* eslint-disable-next-line no-console */
    console.error('CustomErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <Icon name={Icons.WARNING} size={32} />
          </div>
          <h2 className="error-boundary__title">{t('general.error.title')}</h2>
          <p className="error-boundary__desc">
            {this.state.errorMessage || t('general.error.desc')}
          </p>
          <div className="error-boundary__actions">
            <Button type="dark" onClick={() => window.location.reload()}>
              {t('ui.button.close')}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
