import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userName: string;
  userEmail?: string;
  userImage?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userEmail, userImage, onMenuClick, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {userEmail}
              </span>
            )}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
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
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 