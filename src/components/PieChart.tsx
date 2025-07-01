import React from 'react';

interface PieChartProps {
  monthlySpending: number;
  monthlyLimit: number;
  remainingBalance: number;
}

const PieChart: React.FC<PieChartProps> = ({ monthlySpending, monthlyLimit, remainingBalance }) => {
  const total = monthlySpending + Math.max(0, monthlyLimit - monthlySpending);
  const spentPercentage = total > 0 ? (monthlySpending / monthlyLimit) * 100 : 0;
  const remainingPercentage = Math.max(0, 100 - spentPercentage);
  
  // SVG circle calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const spentStrokeDasharray = `${(spentPercentage / 100) * circumference} ${circumference}`;
  const remainingStrokeDasharray = `${(remainingPercentage / 100) * circumference} ${circumference}`;
  const remainingStrokeDashoffset = -((spentPercentage / 100) * circumference);

  const isOverLimit = monthlySpending > monthlyLimit;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          
          {/* Spent amount arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={isOverLimit ? "#dc2626" : "#ef4444"}
            strokeWidth="10"
            strokeDasharray={spentStrokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Remaining limit arc */}
          {!isOverLimit && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth="10"
              strokeDasharray={remainingStrokeDasharray}
              strokeDashoffset={remainingStrokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          )}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700">
              {isOverLimit ? 'Over Limit' : 'Monthly'}
            </div>
            <div className="text-xs text-gray-500">
              {isOverLimit ? `+₹${(monthlySpending - monthlyLimit).toFixed(0)}` : 'Spending'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${isOverLimit ? 'bg-red-600' : 'bg-red-500'} rounded-full`}></div>
          <span className="text-sm text-gray-600">
            Spent: ₹{monthlySpending.toFixed(0)} ({spentPercentage.toFixed(1)}%)
          </span>
        </div>
        {!isOverLimit && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Remaining: ₹{(monthlyLimit - monthlySpending).toFixed(0)} ({remainingPercentage.toFixed(1)}%)
            </span>
          </div>
        )}
        {isOverLimit && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-sm text-red-600 font-medium">
              Limit Exceeded!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;