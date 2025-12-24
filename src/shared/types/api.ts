export type WalletStatus = 'active' | 'restricted' | 'suspended';
export type RiskLevel = 'low' | 'medium' | 'high';
export type KycStatus = 'UNKNOWN' | 'UNVERIFIED' | 'VERIFIED' | 'CONTRACTED';
export type TransactionSide = 'credit' | 'debit';
export type TransactionType = 'DEBIT' | 'CREDIT';
export type TransferDirection = 'INCOMING' | 'OUTGOING';
export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'reversed'
  | 'unknown';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  walletNumber?: string;
  nationalId?: number;
  dateOfBirth?: string;
  address?: {
    country?: string;
    city?: string;
    postalCode?: string;
    line1?: string;
  };
  kycStatus?: KycStatus;
  isActive?: boolean;
  riskLevel?: RiskLevel;
  createdAt?: string;
  updatedAt?: string;
  wallet?: Wallet;
}

export interface Wallet {
  id: string;
  customerId?: string;
  balance: number;
  currency: string;
  availableLimit?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  status?: WalletStatus;
  lastUpdated?: string;
  totalReceived?: number;
  totalSpent?: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  description?: string;
  status?: TransactionStatus;
  side?: TransactionSide;
  type?: string;
  transferDirection?: string;
  merchantName?: string;
  createdAt: string;
  counterparty?: string;
  channel?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalCount?: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  data?: T[];
  meta: PaginationMeta;
  total?: number;
  totalCount?: number;
}

export interface CustomerFilters {
  search?: string;
  status?: WalletStatus | 'all';
  kycStatus?: KycStatus | 'all';
  isActive?: 'all' | 'true' | 'false';
  page?: number;
  pageSize?: number;
}

export interface TransactionFilters {
  transferDirection?: TransferDirection | 'all';
  type?: TransactionType | 'all';
  currency?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: number;
  address: {
    country: string;
    city: string;
    postalCode: string;
    line1: string;
  };
  dailyLimit: number;
  availableLimit: number;
  currency: string;
}

export interface UpdateCustomerPayload extends CreateCustomerPayload {
  kycStatus: KycStatus;
  isActive: boolean;
}

export interface UpdateWalletLimitPayload {
  customerId: string;
  availableLimit: number;
  dailyLimit: number;
}
