import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BudgetPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const budgets = [
    {
      id: 1,
      category: 'Food & Dining',
      budget: 500,
      spent: 375.50,
      color: '#8b5cf6',
      icon: '🍕'
    },
    {
      id: 2,
      category: 'Transportation',
      budget: 300,
      spent: 245.00,
      color: '#14b8a6',
      icon: '🚗'
    },
    {
      id: 3,
      category: 'Entertainment',
      budget: 200,
      spent: 85.99,
      color: '#ec4899',
      icon: '🎬'
    },
    {
      id: 4,
      category: 'Shopping',
      budget: 400,
      spent: 320.00,
      color: '#3b82f6',
      icon: '🛍️'
    },
    {
      id: 5,
      category: 'Utilities',
      budget: 150,
      spent: 142.50,
      color: '#f59e0b',
      icon: '⚡'
    },
    {
      id: 6,
      category: 'Healthcare',
      budget: 100,
      spent: 45.00,
      color: '#10b981',
      icon: '🏥'
    }
  ];

  const budgetData = [
    { category: 'Food & Dining', budget: 500, spent: 375.50 },
    { category: 'Transportation', budget: 300, spent: 245.00 },
    { category: 'Entertainment', budget: 200, spent: 85.99 },
    { category: 'Shopping', budget: 400, spent: 320.00 },
    { category: 'Utilities', budget: 150, spent: 142.50 },
    { category: 'Healthcare', budget: 100, spent: 45.00 }
  ];

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = (totalSpent / totalBudget) * 100;

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Track your spending against your budgets</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Budget
          </button>
        </div>
      </div>

      {/* Overall Budget Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Budget Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-green-600">${totalRemaining.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(1)}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor(overallProgress)}`}
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const remaining = budget.budget - budget.spent;
          
          return (
            <div key={budget.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl">
                    {budget.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500">Budget: ${budget.budget}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    percentage >= 90 ? 'text-red-600' : percentage >= 75 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium">${budget.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${remaining.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
                <button className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget vs Spending Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
            <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetPage; 