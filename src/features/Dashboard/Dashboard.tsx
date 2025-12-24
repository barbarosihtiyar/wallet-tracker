import './dashboard.scss';

import { useQueryClient } from '@tanstack/react-query';
import { Card, Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Config } from '@/app/router/config';
import { ToastFunction } from '@/components';
import {
  resetFilters,
  setFilters,
  setSelectedCustomerId,
} from '@/redux/slices/Dashboard/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { notifyError } from '@/shared/lib';
import { CreateCustomerPayload, Customer } from '@/shared/types/api';

import {
  useCreateCustomerMutation,
  useCustomersQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} from './api';
import CustomerForm from './components/CustomerForm';
import CustomerTable from './components/CustomerTable';
import Filters from './components/Filters';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { filters, selectedCustomerId } = useAppSelector(
    state => state.dashboard,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const customersQuery = useCustomersQuery(filters);

  const selectedCustomer = useMemo(() => {
    if (!customersQuery.data?.items?.length) return undefined;
    return (
      customersQuery.data.items.find(item => item.id === selectedCustomerId) ||
      customersQuery.data.items[0]
    );
  }, [customersQuery.data, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomer && customersQuery.data?.items?.length) {
      dispatch(setSelectedCustomerId(customersQuery.data.items[0].id));
    }
  }, [customersQuery.data?.items, selectedCustomer, dispatch]);

  const createCustomerMutation = useCreateCustomerMutation({
    onSuccess: () => {
      ToastFunction(
        t('dashboard.toasts.customerCreated.title'),
        t('dashboard.toasts.customerCreated.message'),
        'success',
      );
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomerMutation = useUpdateCustomerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsEditOpen(false);
      setEditingCustomer(null);
      ToastFunction(
        t('dashboard.toasts.customerCreated.title'),
        t('dashboard.toasts.customerCreated.message'),
        'success',
      );
    },
  });

  const deleteCustomerMutation = useDeleteCustomerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      ToastFunction(
        t('dashboard.toasts.limitsUpdated.title'),
        t('dashboard.toasts.limitsUpdated.message'),
        'success',
      );
    },
  });

  const handleCustomerSubmit = async (values: CreateCustomerPayload) => {
    try {
      await createCustomerMutation.mutateAsync(values);
    } catch (error) {
      notifyError(
        error,
        'general.error.title',
        'dashboard.errors.createCustomer',
      );
    }
  };

  const handleEditSubmit = async (values: CreateCustomerPayload) => {
    if (!editingCustomer) return;
    try {
      await updateCustomerMutation.mutateAsync({
        id: editingCustomer.id,
        payload: {
          ...values,
          kycStatus: editingCustomer.kycStatus || 'UNKNOWN',
          isActive: editingCustomer.isActive ?? true,
        },
      });
    } catch (error) {
      notifyError(
        error,
        'general.error.title',
        'dashboard.errors.createCustomer',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomerMutation.mutateAsync(id);
    } catch (error) {
      notifyError(
        error,
        'general.error.title',
        'dashboard.errors.createCustomer',
      );
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__hero">
          <div>
            <p className="dashboard__eyebrow">{t('dashboard.title.eyebrow')}</p>
            <h1 className="dashboard__title">{t('dashboard.title.main')}</h1>
            <p className="dashboard__subtitle">{t('dashboard.title.sub')}</p>
          </div>
          <div className="dashboard__hero-meta">
            <span className="dashboard__badge">
              {t('dashboard.title.badge')}
            </span>
            <p className="dashboard__meta">
              {t('dashboard.title.retries', { count: 2 })}{' '}
              <span>{t('dashboard.title.cancellation')}</span>
            </p>
          </div>
        </div>

        <div className="dashboard__grid dashboard__grid--home">
          <Card className="dashboard__panel dashboard__panel--wide">
            <div className="dashboard__panel-header">
              <div>
                <h2>{t('dashboard.customers.title')}</h2>
                <p>{t('dashboard.customers.subtitle')}</p>
              </div>
            </div>

            <Filters
              filters={filters}
              onChange={next => dispatch(setFilters(next))}
              onReset={() => dispatch(resetFilters())}
            />

            <CustomerTable
              data={customersQuery.data}
              loading={customersQuery.isFetching}
              onRowSelect={record => {
                dispatch(setSelectedCustomerId(record.id));
                navigate(
                  `${Config.CUSTOMER_DETAIL.replace(':customerId', record.id)}`,
                );
              }}
              onPageChange={page => dispatch(setFilters({ page }))}
              onEdit={record => {
                setEditingCustomer(record);
                setIsEditOpen(true);
              }}
              onDelete={handleDelete}
            />
          </Card>

          <Card className="dashboard__panel">
            <CustomerForm
              onSubmit={handleCustomerSubmit}
              loading={createCustomerMutation.isPending}
            />
          </Card>
        </div>
      </div>

      <Modal
        open={isEditOpen}
        title={t('dashboard.forms.customer.title')}
        footer={null}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingCustomer(null);
        }}
        destroyOnClose
      >
        {editingCustomer && (
          <CustomerForm
            onSubmit={handleEditSubmit}
            loading={updateCustomerMutation.isPending}
            initialValues={{
              name: editingCustomer.name,
              email: editingCustomer.email,
              phone: editingCustomer.phone || '',
              dateOfBirth: editingCustomer.dateOfBirth || '',
              nationalId: editingCustomer.nationalId ?? 0,
              address: {
                country: editingCustomer.address?.country || '',
                city: editingCustomer.address?.city || '',
                postalCode: editingCustomer.address?.postalCode || '',
                line1: editingCustomer.address?.line1 || '',
              },
              availableLimit: editingCustomer.wallet?.availableLimit,
              dailyLimit: editingCustomer.wallet?.dailyLimit,
              currency: editingCustomer.wallet?.currency || 'TRY',
            }}
          />
        )}
      </Modal>
    </section>
  );
};

export default Dashboard;
