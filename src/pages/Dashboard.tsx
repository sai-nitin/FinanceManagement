import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Plus, QrCode, Ban } from 'lucide-react';
import { getFinanceData, saveFinanceData } from '../utils/storage';
import { calculateStats, formatCurrency, canMakeTransaction } from '../utils/calculations';
import PieChart from '../components/PieChart';
import SpendingAlert from '../components/SpendingAlert';
import QRScanner from '../components/QRScanner';
import { FinanceData, QRPaymentData } from '../types';

const Dashboard: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  const [showSpendingAlert, setShowSpendingAlert] = useState(false);
  const [alertType, setAlertType] = useState<'warning' | 'blocked'>('warning');

  useEffect(() => {
    const data = getFinanceData();
    setFinanceData(data);
    
    // Check spending status
    const stats = calculateStats(data.transactions, data.initialBalance, data.monthlySpendingLimit);
    if (stats.isLimitExceeded) {
      setShowSpendingAlert(true);
      setAlertType('blocked');
    } else if (stats.monthlySpending / stats.monthlySpendingLimit > 0.8) {
      setShowSpendingAlert(true);
      setAlertType('warning');
    }
  }, []);

  const handleSetLimit = () => {
    if (financeData && newLimit && !isNaN(Number(newLimit))) {
      const updatedData = {
        ...financeData,
        monthlySpendingLimit: Number(newLimit)
      };
      setFinanceData(updatedData);
      saveFinanceData(updatedData);
      setShowLimitModal(false);
      setNewLimit('');
    }
  };

  const handleQRPayment = (paymentData: QRPaymentData) => {
    if (!financeData) return;

    const stats = calculateStats(financeData.transactions, financeData.initialBalance, financeData.monthlySpendingLimit);
    const transactionCheck = canMakeTransaction(
      paymentData.amount,
      stats.remainingBalance,
      stats.monthlySpending,
      stats.monthlySpendingLimit
    );

    if (!transactionCheck.canProceed) {
      alert(`Transaction failed: ${transactionCheck.reason}`);
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: paymentData.amount,
      type: 'debit' as const,
      description: `QR Payment - ${paymentData.merchant}`,
      category: 'QR Payment',
      paymentMethod: 'UPI',
      month: new Date().toISOString().substring(0, 7)
    };

    const updatedTransactions = [...financeData.transactions, newTransaction];
    const updatedData = {
      ...financeData,
      transactions: updatedTransactions,
      currentBalance: stats.remainingBalance - paymentData.amount
    };

    setFinanceData(updatedData);
    saveFinanceData(updatedData);

    // Check if this payment puts us over the limit
    const newStats = calculateStats(updatedTransactions, financeData.initialBalance, financeData.monthlySpendingLimit);
    if (newStats.isLimitExceeded) {
      setShowSpendingAlert(true);
      setAlertType('blocked');
    }
  };

  if (!financeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = calculateStats(financeData.transactions, financeData.initialBalance, financeData.monthlySpendingLimit);
  const canAddTransaction = !stats.isLimitExceeded;

  const cards = [
    {
      title: 'Bank Balance',
      value: formatCurrency(stats.remainingBalance),
      icon: Wallet,
      color: stats.remainingBalance > 0 ? 'green' : 'red',
      change: null
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(stats.monthlySpending),
      icon: TrendingDown,
      color: stats.isLimitExceeded ? 'red' : stats.monthlySpending / stats.monthlySpendingLimit > 0.8 ? 'yellow' : 'blue',
      change: `${((stats.monthlySpending / stats.monthlySpendingLimit) * 100).toFixed(1)}% of limit`
    },
    {
      title: 'Monthly Limit',
      value: formatCurrency(stats.monthlySpendingLimit),
      icon: Target,
      color: 'blue',
      change: stats.isLimitExceeded ? 'EXCEEDED' : `₹${(stats.monthlySpendingLimit - stats.monthlySpending).toFixed(0)} left`
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'green',
      change: '+12.5%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Spending Alert */}
        <SpendingAlert
          isVisible={showSpendingAlert}
          onClose={() => setShowSpendingAlert(false)}
          monthlySpending={stats.monthlySpending}
          monthlyLimit={stats.monthlySpendingLimit}
          type={alertType}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track your spending and stay within your monthly budget</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map(({ title, value, icon: Icon, color, change }) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  color === 'green' ? 'bg-green-100' :
                  color === 'red' ? 'bg-red-100' :
                  color === 'yellow' ? 'bg-yellow-100' :
                  color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    color === 'green' ? 'text-green-600' :
                    color === 'red' ? 'text-red-600' :
                    color === 'yellow' ? 'text-yellow-600' :
                    color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                {change && (
                  <span className={`text-sm font-medium ${
                    change.includes('EXCEEDED') ? 'text-red-600' :
                    change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {change}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Spending Overview</h2>
              <PieChart
                monthlySpending={stats.monthlySpending}
                monthlyLimit={stats.monthlySpendingLimit}
                remainingBalance={stats.remainingBalance}
              />
            </div>
          </div>

          {/* Quick Actions & Recent Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowLimitModal(true)}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-600">Set Monthly Limit</span>
                </button>
                
                <button
                  onClick={() => setShowQRScanner(true)}
                  disabled={!canAddTransaction}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                    canAddTransaction 
                      ? 'bg-green-50 hover:bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="font-medium">Make Payment</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/transactions'}
                  disabled={!canAddTransaction}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                    canAddTransaction 
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAddTransaction ? <Plus className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                  <span className="font-medium">Add Transaction</span>
                </button>
              </div>
              
              {!canAddTransaction && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ Monthly spending limit exceeded. Transaction buttons are disabled.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {financeData.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.paymentMethod}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onPaymentDetected={handleQRPayment}
        />

        {/* Set Limit Modal */}
        {showLimitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Set Monthly Spending Limit</h2>
              <p className="text-gray-600 mb-4">
                Set your monthly spending limit. You'll receive alerts and transaction blocking when this limit is exceeded.
              </p>
              <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Enter monthly limit in ₹"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSetLimit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Limit
                </button>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;