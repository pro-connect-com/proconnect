// src/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-[#1A2E4D] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-[#2ECC71] font-bold text-2xl mr-2">PC</span>
          <span className="font-bold hidden md:inline">ProConnect</span>
        </div>

        {/* Search (mobile: hidden) */}
        <div className="hidden md:block w-1/3">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-1 rounded-full bg-[#1A3A5F] text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-1 relative">
            <span className="absolute top-0 right-0 bg-[#2ECC71] rounded-full w-2 h-2"></span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full border-2 border-[#2ECC71] bg-gray-300"></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;