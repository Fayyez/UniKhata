import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userName: string;
  userImage?: string;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userImage, onMenuClick }) => {
  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed w-full top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="text-3xl font-bold text-gray-800 dark:text-white font-['Google Sans']">
              UniKhata
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-300 text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 