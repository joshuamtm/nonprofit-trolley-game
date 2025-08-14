import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClass = (path: string) => {
    const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    return isActive(path) 
      ? `${base} bg-blue-600 text-white`
      : `${base} text-gray-600 hover:bg-gray-100`;
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">Career Compass</h1>
            <span className="text-sm text-gray-500">for Clark</span>
          </div>
          
          <div className="flex space-x-2">
            <Link to="/" className={linkClass('/')}>
              Decision Central
            </Link>
            <Link to="/daily" className={linkClass('/daily')}>
              Daily Actions
            </Link>
            <Link to="/financial" className={linkClass('/financial')}>
              Financial Reality
            </Link>
            <Link to="/progress" className={linkClass('/progress')}>
              Progress
            </Link>
            <Link to="/settings" className={linkClass('/settings')}>
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;