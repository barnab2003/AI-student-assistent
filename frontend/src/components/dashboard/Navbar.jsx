import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2 font-bold text-xl text-blue-600">
          <span>🚀 SmartStudy.cs</span>
        </div>
        
        <div className="flex space-x-1">
          {['home', 'roadmap', 'community'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;