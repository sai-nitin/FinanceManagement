import { Transaction, DashboardStats } from '../types';

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const calculateStats = (
  transactions: Transaction[],
  initialBalance: number,
  monthlySpendingLimit: number
): DashboardStats => {
  const currentMonth = getCurrentMonth();
  
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlySpending = transactions
    .filter(t => t.type === 'debit' && t.month === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const remainingBalance = initialBalance + totalIncome - totalExpenses;
  const isLimitExceeded = monthlySpending >= monthlySpendingLimit;
  
  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlySpending,
    monthlySpendingLimit,
    isLimitExceeded
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const canMakeTransaction = (
  amount: number,
  currentBalance: number,
  monthlySpending: number,
  monthlyLimit: number
): { canProceed: boolean; reason?: string } => {
  if (amount > currentBalance) {
    return { canProceed: false, reason: 'Insufficient balance' };
  }
  
  if (monthlySpending + amount > monthlyLimit) {
    return { canProceed: false, reason: 'Monthly spending limit exceeded' };
  }
  
  return { canProceed: true };
};