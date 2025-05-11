import React from 'react';
import { Link } from 'react-router-dom';
import fayye from '../assets/fayye.jpg';
import eehab from '../assets/eehab.jpg';
import huzyefa from '../assets/huzyefa.jpg';
import ta from '../assets/ta.jpg';
import nayel from '../assets/nayel.jpg';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-[#1a73e8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to UniKhata
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your All-in-One Business Management Solution for E-commerce Integration
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-[#1a73e8] rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To empower businesses with a unified platform that simplifies operations,
            enhances productivity, and drives growth through seamless integration
            of essential business tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unified Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get a comprehensive view of your business operations in one place. Monitor sales, inventory, and customer data from multiple platforms simultaneously.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Seamless Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect your favorite e-commerce platforms and courier services effortlessly. Our system works with all major providers including Shopify, WooCommerce, and more.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Smart Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Make data-driven decisions with our comprehensive analytics tools. Get insights on sales trends, inventory performance, and customer behavior across all your platforms.
            </p>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              About Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              UniKhata was born out of a desire to simplify business operations for e-commerce entrepreneurs. We noticed many store owners struggle with managing multiple platforms, keeping track of inventory across different channels, and handling order fulfillment efficiently.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Story</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2023, UniKhata has quickly grown from a small project to a comprehensive business management solution. Our team of developers, designers, and business experts work tirelessly to create a platform that truly meets the needs of modern e-commerce businesses.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in creating technology that adapts to your business, not the other way around. Every feature in UniKhata is designed with real business challenges in mind, ensuring you have the tools you need to succeed in today's competitive market.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="bg-[#1a73e8]/10 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">Why Choose UniKhata?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#1a73e8] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">All-in-one platform for multiple integrations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#1a73e8] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">Real-time synchronization across platforms</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#1a73e8] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">Powerful analytics to drive business growth</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#1a73e8] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">Dedicated support from industry experts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The brilliant minds behind UniKhata who turned an idea into reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-64 overflow-hidden">
              <img src={fayye} alt="Fayyez" className="w-full h-full object-cover object-center" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Fayyez</h3>
              <p className="text-[#1a73e8] mb-3 font-medium">Code Whisperer & Deadline Wizard</p>
              <p className="text-gray-600 dark:text-gray-300">
                Leading our architectural design with a vision that combines technical excellence and business value. Also doubles as our impromptu Project Manager when deadlines approach.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-64 overflow-hidden">
              <img src={eehab} alt="Eehab" className="w-full h-full object-cover object-center" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Eehab</h3>
              <p className="text-[#1a73e8] mb-3 font-medium">SQL Sorcerer & Backend Ninja</p>
              <p className="text-gray-600 dark:text-gray-300">
                Our backend maestro with an uncanny ability to make servers bend to his will. If there's data that needs moving, storing, or processing, Eehab has already written the API for it.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-64 overflow-hidden">
              <img src={huzyefa} alt="Huzyefa" className="w-full h-full object-cover object-center" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Huzyefa</h3>
              <p className="text-[#1a73e8] mb-3 font-medium">CSS Therapist & React Whisperer</p>
              <p className="text-gray-600 dark:text-gray-300">
                The UI virtuoso who translates complex functionality into intuitive user experiences. Armed with React and an eye for design, Huzyefa ensures UniKhata is as beautiful as it is functional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Mentions Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Special Mentions - Our Pookies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We couldn't have done it without these amazing people.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex">
              <div className="w-1/3">
                <img src={ta} alt="TA" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Our Amazing TA</h3>
                <p className="text-[#1a73e8] mb-3 font-medium">Deadline Bender & Error Whisperer</p>
                <p className="text-gray-600 dark:text-gray-300">
                  For being incredibly understanding about our last-minute changes and always providing constructive feedback that helped shape UniKhata into what it is today.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex">
              <div className="w-1/3">
                <img src={nayel} alt="Nayel" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Nayel</h3>
                <p className="text-[#1a73e8] mb-3 font-medium">Chief Awww Officer (CAO)</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Because he's just a cutie anyway! Nayel's positive energy and enthusiasm kept our spirits high during the most challenging phases of the project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">UniKhata</h3>
              <p className="text-gray-400 mb-4">
                Your all-in-one business management solution for e-commerce integration and order management.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.035 10.035 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="https://github.com/fayyez/UniKhata" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">E-commerce Integration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inventory Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Courier Services</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community Forums</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 UniKhata. All rights reserved.</p>
            <p className="mt-2 text-sm">Made with ❤️ by Team UniKhata</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;