// src/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '💼', label: 'Jobs' },
    { icon: '🤝', label: 'Network' },
    { icon: '📁', label: 'Applications' },
    { icon: '👤', label: 'Profile' },
    { icon: '⚙️', label: 'Settings' }
  ];

  return (
    <aside className="w-16 md:w-64 bg-[#1A2E4D] text-white p-2 transition-all duration-300">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className="flex items-center w-full p-3 rounded-lg hover:bg-[#2ECC71]/10 mb-1"
        >
          <span className="text-xl mr-3">{item.icon}</span>
          <span className="hidden md:inline">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;