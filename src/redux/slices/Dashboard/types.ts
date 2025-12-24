import { KycStatus, WalletStatus } from '@/shared/types/api';

export interface DashboardFilters {
  search: string;
  status: WalletStatus | 'all';
  kycStatus: KycStatus | 'all';
  isActive: 'all' | 'true' | 'false';
  page: number;
  pageSize: number;
}

export interface DashboardState {
  filters: DashboardFilters;
  selectedCustomerId?: string;
}
