import { FinanceData, Transaction } from '../types';
import { dummyTransactions } from '../data/dummyTransactions';
import { getCurrentMonth } from './calculations';

const STORAGE_KEY = 'financeTrackerData';

export const getFinanceData = (): FinanceData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    // Ensure all transactions have month field
    data.transactions = data.transactions.map((t: Transaction) => ({
      ...t,
      month: t.month || t.date.substring(0, 7)
    }));
    return data;
  }
  
  // Default data with dummy transactions
  const defaultData: FinanceData = {
    initialBalance: 25000,
    currentBalance: 25000,
    monthlySpendingLimit: 15000,
    transactions: dummyTransactions,
    alertPreferences: {
      visual: true,
      sound: false
    },
    isSpendingBlocked: false
  };
  
  // Calculate current balance based on transactions
  const totalIncome = dummyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = dummyTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  defaultData.currentBalance = defaultData.initialBalance + totalIncome - totalExpenses;
  
  saveFinanceData(defaultData);
  return defaultData;
};

export const saveFinanceData = (data: FinanceData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateBalance = (transactions: Transaction[], initialBalance: number): number => {
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return initialBalance + totalIncome - totalExpenses;
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'month'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    month: transaction.date.substring(0, 7)
  };
  
  const data = getFinanceData();
  data.transactions.push(newTransaction);
  data.currentBalance = updateBalance(data.transactions, data.initialBalance);
  
  saveFinanceData(data);
  return newTransaction;
};