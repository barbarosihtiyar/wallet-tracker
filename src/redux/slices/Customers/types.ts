export interface Address {
  country: string;
  city: string;
  postalCode: string;
  line1: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletNumber?: string;
  dateOfBirth: string;
  nationalId: number;
  address: Address;
  kycStatus: "UNKNOWN" | "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: number;
  address: Address;
}

export interface UpdateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: number;
  address: Address;
  kycStatus: "UNKNOWN" | "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
}

export interface CustomerFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  kycStatus?: "UNKNOWN" | "PENDING" | "APPROVED" | "REJECTED" | "all";
  isActive?: boolean | "all";
}

export interface PaginatedCustomersResponse {
  page: number;
  pageSize: number;
  total: number;
  data: Customer[];
}

export interface CustomersState {
  customers: Customer[];
  currentCustomer: Customer | null;
  filters: CustomerFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  loading: {
    list: boolean;
    detail: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
}
