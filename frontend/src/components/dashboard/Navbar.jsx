import React from 'react';
import { Menu } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = ({ activeTab, setActiveTab, toggleSidebar }) => { // <--- ADD toggleSidebar HERE
  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-20">
        
        {/* Hamburger Menu & Brand Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          
          <button onClick={toggleSidebar} className="p-2 sm:p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">
            <Menu size={24} className="text-black" strokeWidth={2.5} />
          </button>

          <div className="flex items-center space-x-3 font-black text-2xl tracking-tight text-black cursor-pointer">
            <img 
              src={logo} 
              alt="SmartStudy Logo" 
              className="h-8 sm:h-10 w-auto" 
            />
            <span className="hidden sm:block">10x.CS</span>
          </div>
        </div>
        
        {/* Navigation Tabs - Adds horizontal scroll for small screens */}
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-2 px-1">
          {['home', 'roadmap', 'community'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm capitalize transition-all border-2 shrink-0 ${
                activeTab === tab 
                  ? 'bg-[#B9FF66] border-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white border-transparent text-gray-600 hover:border-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]'
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