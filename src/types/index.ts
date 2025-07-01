export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  category: string;
  paymentMethod: string;
  month: string; // Format: YYYY-MM
}

export interface FinanceData {
  initialBalance: number;
  currentBalance: number;
  monthlySpendingLimit: number;
  transactions: Transaction[];
  alertPreferences: {
    visual: boolean;
    sound: boolean;
  };
  isSpendingBlocked: boolean;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  monthlySpending: number;
  monthlySpendingLimit: number;
  isLimitExceeded: boolean;
}

export interface QRPaymentData {
  amount: number;
  merchant: string;
  upiId: string;
  description: string;
}