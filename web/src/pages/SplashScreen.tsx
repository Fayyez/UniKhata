import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 2 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a73e8]">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg className="w-full h-full text-white animate-bounce" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">UniKhata</h1>
        <p className="text-white/80">Your Business, Simplified</p>
      </div>
    </div>
  );
};

export default SplashScreen; 