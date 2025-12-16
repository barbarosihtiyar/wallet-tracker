export interface Wallet {
  customerId: string;
  currency: string;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface UpdateWalletLimitsPayload {
  dailyLimit: number;
  monthlyLimit: number;
}

export interface WalletsState {
  wallets: Record<string, Wallet>;
  currentWallet: Wallet | null;
  loading: {
    fetch: boolean;
    update: boolean;
  };
  error: string | null;
}
