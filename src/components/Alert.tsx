import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  isVisible: boolean;
  onClose: () => void;
  balance: number;
  limit: number;
}

const Alert: React.FC<AlertProps> = ({ isVisible, onClose, balance, limit }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Banner Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Balance Alert
              </h3>
              <p className="text-sm text-red-700">
                Your balance (₹{balance.toFixed(2)}) is below your set limit (₹{limit.toFixed(2)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal Alert */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl animate-pulse">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Balance Alert!
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Your balance is below your set limit! Please control your expenses.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Current Balance:</span>
              <span className="font-semibold text-red-600">₹{balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Set Limit:</span>
              <span className="font-semibold text-gray-900">₹{limit.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;