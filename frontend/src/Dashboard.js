import React from 'react';
import HomeDashboard from './pages/HomeDashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import RecurringPage from './pages/RecurringPage';
import ReportsPage from './pages/ReportsPage';

const Dashboard = ({ currentPage }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeDashboard />;
      case 'transactions':
        return <TransactionsPage />;
      case 'budget':
        return <BudgetPage />;
      case 'recurring':
        return <RecurringPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="p-6">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard; 