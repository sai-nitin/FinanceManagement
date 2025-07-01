import React, { useState, useEffect } from 'react';
import { Save, Bell, Smartphone, Shield, Trash2, Target } from 'lucide-react';
import { getFinanceData, saveFinanceData } from '../utils/storage';
import { formatCurrency, calculateStats } from '../utils/calculations';
import { FinanceData } from '../types';

const Settings: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [settings, setSettings] = useState({
    initialBalance: '',
    monthlySpendingLimit: '',
    visualAlerts: true,
    soundAlerts: false
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const data = getFinanceData();
    setFinanceData(data);
    setSettings({
      initialBalance: data.initialBalance.toString(),
      monthlySpendingLimit: data.monthlySpendingLimit.toString(),
      visualAlerts: data.alertPreferences.visual,
      soundAlerts: data.alertPreferences.sound
    });
  }, []);

  const handleSave = () => {
    if (!financeData) return;

    const updatedData: FinanceData = {
      ...financeData,
      initialBalance: Number(settings.initialBalance) || financeData.initialBalance,
      monthlySpendingLimit: Number(settings.monthlySpendingLimit) || financeData.monthlySpendingLimit,
      alertPreferences: {
        visual: settings.visualAlerts,
        sound: settings.soundAlerts
      }
    };

    // Recalculate current balance based on new initial balance
    const totalIncome = financeData.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = financeData.transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    updatedData.currentBalance = updatedData.initialBalance + totalIncome - totalExpenses;

    setFinanceData(updatedData);
    saveFinanceData(updatedData);
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    localStorage.removeItem('financeTrackerData');
    window.location.reload();
  };

  if (!financeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = calculateStats(financeData.transactions, financeData.initialBalance, financeData.monthlySpendingLimit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your finance tracking preferences</p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-1 mr-3">
                <Save className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-green-800 font-medium">{savedMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Bank Balance (₹)
                </label>
                <input
                  type="number"
                  value={settings.initialBalance}
                  onChange={(e) => setSettings({ ...settings, initialBalance: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your initial bank balance"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will recalculate your current balance based on existing transactions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Spending Limit (₹)
                </label>
                <input
                  type="number"
                  value={settings.monthlySpendingLimit}
                  onChange={(e) => setSettings({ ...settings, monthlySpendingLimit: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Set your monthly spending limit"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Transactions will be blocked when this limit is exceeded
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Alert Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Visual Alerts</h3>
                    <p className="text-sm text-gray-600">Show pop-up and banner alerts for spending limits</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.visualAlerts}
                    onChange={(e) => setSettings({ ...settings, visualAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Sound Alerts</h3>
                    <p className="text-sm text-gray-600">Play notification sounds for alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) => setSettings({ ...settings, soundAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Financial Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Bank Balance</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.remainingBalance)}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${stats.isLimitExceeded ? 'bg-red-50' : 'bg-yellow-50'}`}>
                <h3 className={`text-sm font-medium mb-1 ${stats.isLimitExceeded ? 'text-red-800' : 'text-yellow-800'}`}>
                  Monthly Spending
                </h3>
                <p className={`text-2xl font-bold ${stats.isLimitExceeded ? 'text-red-600' : 'text-yellow-600'}`}>
                  {formatCurrency(stats.monthlySpending)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((stats.monthlySpending / stats.monthlySpendingLimit) * 100).toFixed(1)}% of limit
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800 mb-1">Monthly Limit</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.monthlySpendingLimit)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {stats.isLimitExceeded ? 'EXCEEDED' : `₹${(stats.monthlySpendingLimit - stats.monthlySpending).toFixed(0)} left`}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-1">Total Transactions</h3>
                <p className="text-2xl font-bold text-green-600">
                  {financeData.transactions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Spending Status Alert */}
          {stats.isLimitExceeded && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-red-900">Spending Limit Status</h2>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">⚠️ Monthly Limit Exceeded</h3>
                <p className="text-sm text-red-800 mb-4">
                  You have exceeded your monthly spending limit by {formatCurrency(stats.monthlySpending - stats.monthlySpendingLimit)}. 
                  New transactions and payments are currently blocked.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-red-700">Monthly Spending:</span>
                    <span className="font-semibold text-red-900 ml-2">{formatCurrency(stats.monthlySpending)}</span>
                  </div>
                  <div>
                    <span className="text-red-700">Monthly Limit:</span>
                    <span className="font-semibold text-red-900 ml-2">{formatCurrency(stats.monthlySpendingLimit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Reset All Data</h3>
              <p className="text-sm text-red-700 mb-4">
                This will permanently delete all your transactions, settings, and reset the app to its initial state. 
                This action cannot be undone.
              </p>
              <button
                onClick={() => setShowResetModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reset All Data
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
                Reset All Data?
              </h2>
              
              <p className="text-center text-gray-600 mb-6">
                This action will permanently delete all your transactions, settings, and data. 
                This cannot be undone.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
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

export default Settings;