// src/Navbar.js
import React from 'react';

const Navbar = ({ user }) => {
  return (
    <header className="bg-[#1A2E4D] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-[#2ECC71] font-bold text-2xl mr-2">PC</span>
          <span className="font-bold hidden md:inline">ProConnect</span>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline">{user.name}</span>
            <div className="w-8 h-8 rounded-full border-2 border-[#2ECC71] bg-gray-300 flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;