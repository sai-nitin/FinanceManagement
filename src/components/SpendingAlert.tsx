import React from 'react';
import { AlertTriangle, X, Ban } from 'lucide-react';

interface SpendingAlertProps {
  isVisible: boolean;
  onClose: () => void;
  monthlySpending: number;
  monthlyLimit: number;
  type: 'warning' | 'blocked';
}

const SpendingAlert: React.FC<SpendingAlertProps> = ({ 
  isVisible, 
  onClose, 
  monthlySpending, 
  monthlyLimit, 
  type 
}) => {
  if (!isVisible) return null;

  const isBlocked = type === 'blocked';
  const percentage = (monthlySpending / monthlyLimit) * 100;

  return (
    <>
      {/* Banner Alert */}
      <div className={`${isBlocked ? 'bg-red-100 border-red-500' : 'bg-yellow-50 border-yellow-400'} border-l-4 p-4 mb-4 rounded-r-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isBlocked ? (
              <Ban className="h-5 w-5 text-red-500 mr-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
            )}
            <div>
              <h3 className={`text-sm font-medium ${isBlocked ? 'text-red-800' : 'text-yellow-800'}`}>
                {isBlocked ? 'Spending Blocked!' : 'Spending Alert'}
              </h3>
              <p className={`text-sm ${isBlocked ? 'text-red-700' : 'text-yellow-700'}`}>
                {isBlocked 
                  ? `Limit Exceeded! No more transactions allowed this month.`
                  : `You've spent ₹${monthlySpending.toFixed(2)} of your ₹${monthlyLimit.toFixed(2)} monthly limit (${percentage.toFixed(1)}%)`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${isBlocked ? 'text-red-400 hover:text-red-600' : 'text-yellow-400 hover:text-yellow-600'} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal Alert for Blocked State */}
      {isBlocked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <Ban className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              Stop Spending!
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
              You have crossed your monthly spending limit. No more transactions are allowed this month.
            </p>
            
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Spending:</span>
                <span className="font-semibold text-red-600">₹{monthlySpending.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Limit:</span>
                <span className="font-semibold text-gray-900">₹{monthlyLimit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exceeded by:</span>
                <span className="font-semibold text-red-600">₹{(monthlySpending - monthlyLimit).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SpendingAlert;