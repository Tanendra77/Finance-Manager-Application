import React, { useState } from 'react';

const RecurringPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const recurringTransactions = [
    {
      id: 1,
      description: 'Monthly rent payment',
      amount: -1200.00,
      category: 'Housing',
      frequency: 'monthly',
      nextDate: '2024-02-01',
      status: 'active',
      icon: '🏠'
    },
    {
      id: 2,
      description: 'Netflix subscription',
      amount: -15.99,
      category: 'Entertainment',
      frequency: 'monthly',
      nextDate: '2024-02-15',
      status: 'active',
      icon: '📺'
    },
    {
      id: 3,
      description: 'Salary deposit',
      amount: 2500.00,
      category: 'Income',
      frequency: 'monthly',
      nextDate: '2024-02-01',
      status: 'active',
      icon: '💰'
    },
    {
      id: 4,
      description: 'Gym membership',
      amount: -45.00,
      category: 'Health & Fitness',
      frequency: 'monthly',
      nextDate: '2024-02-10',
      status: 'paused',
      icon: '💪'
    },
    {
      id: 5,
      description: 'Car insurance',
      amount: -180.00,
      category: 'Insurance',
      frequency: 'monthly',
      nextDate: '2024-02-20',
      status: 'active',
      icon: '🚗'
    },
    {
      id: 6,
      description: 'Internet bill',
      amount: -89.99,
      category: 'Utilities',
      frequency: 'monthly',
      nextDate: '2024-02-05',
      status: 'active',
      icon: '🌐'
    }
  ];

  const filteredTransactions = recurringTransactions.filter(transaction => {
    return filterStatus === 'all' || transaction.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      case 'monthly':
        return '📅';
      case 'yearly':
        return '📊';
      default:
        return '🔄';
    }
  };

  const totalIncome = recurringTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = recurringTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recurring Transactions</h1>
          <p className="text-gray-600">Manage your automated transactions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add Recurring
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recurring Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recurring Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Monthly Impact</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalIncome - totalExpenses).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('paused')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'paused' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paused
            </button>
          </div>
        </div>
      </div>

      {/* Recurring Transactions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl">
                  {transaction.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount</span>
                <span className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Frequency</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{getFrequencyIcon(transaction.frequency)}</span>
                  <span className="text-sm font-medium capitalize">{transaction.frequency}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Date</span>
                <span className="text-sm font-medium">{transaction.nextDate}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit
              </button>
              <button className="flex-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                {transaction.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Transactions</h3>
        <div className="space-y-3">
          {recurringTransactions
            .filter(t => t.status === 'active')
            .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
            .slice(0, 5)
            .map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.nextDate}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecurringPage; 