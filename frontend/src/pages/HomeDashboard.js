import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const HomeDashboard = () => {
  // Mock data for charts
  const spendingData = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 1800 },
    { name: 'Mar', amount: 1500 },
    { name: 'Apr', amount: 2200 },
    { name: 'May', amount: 1900 },
    { name: 'Jun', amount: 2400 }
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 35, color: '#8b5cf6' },
    { name: 'Transportation', value: 25, color: '#14b8a6' },
    { name: 'Entertainment', value: 20, color: '#ec4899' },
    { name: 'Shopping', value: 15, color: '#3b82f6' },
    { name: 'Others', value: 5, color: '#f59e0b' }
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Grocery shopping at Walmart',
      amount: -75.50,
      category: 'Food & Dining',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: 2,
      description: 'Salary deposit',
      amount: 2500.00,
      category: 'Income',
      date: '2024-01-14',
      type: 'income'
    },
    {
      id: 3,
      description: 'Gas station',
      amount: -45.00,
      category: 'Transportation',
      date: '2024-01-13',
      type: 'expense'
    },
    {
      id: 4,
      description: 'Netflix subscription',
      amount: -15.99,
      category: 'Entertainment',
      date: '2024-01-12',
      type: 'expense'
    }
  ];

  const summaryCards = [
    {
      title: 'Total Balance',
      amount: '$2,450.50',
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Income',
      amount: '$4,200.00',
      change: '+8.2%',
      changeType: 'positive',
      icon: '📈',
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Expenses',
      amount: '$1,749.50',
      change: '-3.1%',
      changeType: 'negative',
      icon: '📉',
      color: 'bg-red-500'
    },
    {
      title: 'Savings Rate',
      amount: '58.3%',
      change: '+5.2%',
      changeType: 'positive',
      icon: '🎯',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.amount}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-white text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard; 