import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', income: 4200, expenses: 2800, savings: 1400 },
    { month: 'Feb', income: 4200, expenses: 3200, savings: 1000 },
    { month: 'Mar', income: 4500, expenses: 2900, savings: 1600 },
    { month: 'Apr', income: 4200, expenses: 3100, savings: 1100 },
    { month: 'May', income: 4800, expenses: 2800, savings: 2000 },
    { month: 'Jun', income: 4200, expenses: 3000, savings: 1200 }
  ];

  const categoryData = [
    { name: 'Food & Dining', amount: 1200, percentage: 35, color: '#8b5cf6' },
    { name: 'Transportation', amount: 850, percentage: 25, color: '#14b8a6' },
    { name: 'Entertainment', amount: 680, percentage: 20, color: '#ec4899' },
    { name: 'Shopping', amount: 510, percentage: 15, color: '#3b82f6' },
    { name: 'Utilities', amount: 170, percentage: 5, color: '#f59e0b' }
  ];

  const budgetVsSpending = [
    { category: 'Food & Dining', budget: 500, spent: 375, remaining: 125 },
    { category: 'Transportation', budget: 300, spent: 245, remaining: 55 },
    { category: 'Entertainment', budget: 200, spent: 85, remaining: 115 },
    { category: 'Shopping', budget: 400, spent: 320, remaining: 80 },
    { category: 'Utilities', budget: 150, spent: 142, remaining: 8 }
  ];

  const savingsTrend = [
    { month: 'Jan', target: 1500, actual: 1400 },
    { month: 'Feb', target: 1500, actual: 1000 },
    { month: 'Mar', target: 1500, actual: 1600 },
    { month: 'Apr', target: 1500, actual: 1100 },
    { month: 'May', target: 1500, actual: 2000 },
    { month: 'Jun', target: 1500, actual: 1200 }
  ];

  const summaryStats = [
    {
      title: 'Total Income',
      value: '$25,200',
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰'
    },
    {
      title: 'Total Expenses',
      value: '$17,800',
      change: '+8.2%',
      changeType: 'negative',
      icon: '💸'
    },
    {
      title: 'Total Savings',
      value: '$7,400',
      change: '+15.3%',
      changeType: 'positive',
      icon: '🎯'
    },
    {
      title: 'Savings Rate',
      value: '29.4%',
      change: '+2.8%',
      changeType: 'positive',
      icon: '📈'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Comprehensive analysis of your financial data</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
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

      {/* Budget vs Spending */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetVsSpending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
            <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Goal Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={savingsTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Target" />
            <Area type="monotone" dataKey="actual" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Category Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Category Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetVsSpending.map((item, index) => {
                const percentage = (item.spent / item.budget) * 100;
                const status = percentage >= 90 ? 'Over Budget' : percentage >= 75 ? 'Warning' : 'On Track';
                const statusColor = percentage >= 90 ? 'text-red-600' : percentage >= 75 ? 'text-yellow-600' : 'text-green-600';
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: categoryData[index]?.color }}></div>
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.spent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.budget.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 