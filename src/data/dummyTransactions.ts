import { Transaction } from '../types';

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-12-15',
    amount: 25000,
    type: 'credit',
    description: 'Salary Credit',
    category: 'Income',
    paymentMethod: 'Bank Transfer',
    month: '2024-12'
  },
  {
    id: '2',
    date: '2024-12-14',
    amount: 150,
    type: 'debit',
    description: 'Coffee Shop',
    category: 'Food & Dining',
    paymentMethod: 'PhonePe',
    month: '2024-12'
  },
  {
    id: '3',
    date: '2024-12-13',
    amount: 450,
    type: 'debit',
    description: 'Grocery Store',
    category: 'Groceries',
    paymentMethod: 'Google Pay',
    month: '2024-12'
  },
  {
    id: '4',
    date: '2024-12-12',
    amount: 1200,
    type: 'debit',
    description: 'Monthly Rent',
    category: 'Housing',
    paymentMethod: 'Bank Transfer',
    month: '2024-12'
  },
  {
    id: '5',
    date: '2024-12-11',
    amount: 320,
    type: 'debit',
    description: 'Movie Ticket',
    category: 'Entertainment',
    paymentMethod: 'Paytm',
    month: '2024-12'
  },
  {
    id: '6',
    date: '2024-12-10',
    amount: 2500,
    type: 'debit',
    description: 'Online Shopping',
    category: 'Shopping',
    paymentMethod: 'Google Pay',
    month: '2024-12'
  },
  {
    id: '7',
    date: '2024-12-09',
    amount: 800,
    type: 'debit',
    description: 'Fuel',
    category: 'Transportation',
    paymentMethod: 'PhonePe',
    month: '2024-12'
  },
  {
    id: '8',
    date: '2024-12-08',
    amount: 5000,
    type: 'credit',
    description: 'Freelance Work',
    category: 'Income',
    paymentMethod: 'Bank Transfer',
    month: '2024-12'
  }
];