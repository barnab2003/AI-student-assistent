import React from 'react';
import { Menu } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = ({ toggleSidebar, activeTab, setActiveTab }) => { // <--- ADD toggleSidebar HERE
  return (
    <nav className="bg-[#111818] border-b border-[#313244] sticky top-0 z-50 font-mono text-[#bac2de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        
        {/* Hamburger Menu & Brand Logo */}
        <div className="flex items-center space-x-4 shrink-0">
          
          {/* Mobile Hamburger (Hidden on desktop since sidebar is fixed) */}
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 text-[#bac2de] hover:text-[#f38ba8] transition-colors cursor-pointer rounded-lg hover:bg-[#1a2322]"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-3 font-bold text-xl tracking-tight cursor-pointer">
            {/* Optional: Keep your image logo, or just use the styled text */}
            {logo && (
              <img 
                src={logo} 
                alt="10xCS Logo" 
                className="h-8 w-auto opacity-90 hidden sm:block" 
              />
            )}
            <span className="text-[#f38ba8] font-sans text-2xl">▲ 10xCS</span>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-2 px-1">
          {['home', 'roadmap', 'community'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all border shrink-0 ${
                activeTab === tab 
                  ? 'bg-[#1a2322] border-[#313244] text-[#89dceb] shadow-sm' 
                  : 'bg-transparent border-transparent text-[#bac2de] hover:text-[#f38ba8] hover:bg-[#1a2322]/50'
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