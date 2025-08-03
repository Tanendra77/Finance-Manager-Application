import React, { useState } from 'react';
import logo from '../assets/FroggyWalletLogo.png';
import LoginForm from './LoginForm';
import '../css/Navbar.css';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogin = () => {
    setShowLoginForm(true);
  };

  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };

  return (
    <nav className="bg-[#6041bf] shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-0">
        <div className="flex items-center h-16">

          {/* Left: Hamburger Menu with 10px spacing */}
          <div className="flex items-center space-x-4 ml-2">
            <button
              onClick={onMenuClick}
              className="setting-btn ml-4"
            >
              <span className="bar bar1"></span>
              <span className="bar bar2"></span>
              <span className="bar bar1"></span>
            </button>
          </div>

          {/* Logo and Website Name */}
          <div className="flex items-center ml-3">
            <img
              src={logo}
              alt="Froggy Wallet Logo"
              className="logo"
            />
            <span className="logo-text">FroggyWallet</span>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <div className="group max-w-md w-full">
              <svg className="icon absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, categories, budgets..."
                className="input w-full h-10 pl-10 pr-4 border-2 border-transparent rounded-lg outline-none bg-gray-100 text-gray-900 transition-all duration-300 placeholder-gray-500 focus:border-pink-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(234,76,137,0.1)] hover:border-pink-400 hover:bg-white"
              />
            </div>
          </div>

          {/* Right: Profile or Login Button */}
          <div className="flex items-center ml-auto mr-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-white">{userProfile.name}</span>
                  <span className="text-xs text-gray-200">{userProfile.email}</span>
                </div>
                <div className="relative">
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-white"
                    src={userProfile.avatar}
                    alt={userProfile.name}
                  />
                  <div className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-white text-[#6041bf] font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginForm isOpen={showLoginForm} onClose={handleCloseLoginForm} />
    </nav>
  );
};

export default Navbar;
