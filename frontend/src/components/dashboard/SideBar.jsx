import React from 'react';
import { Home, Map, Globe, Trophy, BrainCircuit, Medal, Settings, Zap, X, Lock } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, setActiveTab, activeTab }) => { // <--- ADDED setActiveTab HERE
  const menuItems = [
   // --- ADD THESE MISSING TABS ---
  { name: "Home", tabId: "home", icon: Home },
  { name: "Roadmap", tabId: "roadmap", icon: Map },
  { name: "Community", tabId: "community", icon: Globe },
  
  // --- KEEP YOUR EXISTING TABS ---
  { name: "Global Leaderboard", tabId: "leaderboard", icon: Trophy },
  { name: "AI Quizzes", tabId: "quizzes", icon: BrainCircuit },
  { name: "My Badges", tabId: "badges", icon: Medal },
  { name: "Settings", tabId: "settings", icon: Settings }
  ];

  return (
    <>
      {/* Dimmed Backdrop (Closes sidebar when clicked - Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* The Sidebar Container */}
      <div 
        className={`fixed md:relative top-0 left-0 h-full w-72 md:w-full bg-[#111818] md:border-none border-r border-[#313244] z-50 transform transition-transform duration-300 ease-in-out flex flex-col font-mono text-[#bac2de] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* Sidebar Header (Only visible on mobile, since Desktop has the top nav) */}
        <div className="md:hidden p-6 border-b border-[#313244] flex justify-between items-center mt-16">
          <span className="text-[#89dceb] font-bold text-lg tracking-tight">Menu</span>
          <button onClick={toggleSidebar} className="text-[#bac2de] hover:text-[#f38ba8] transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Desktop Logo Space (Hidden on mobile) */}
        <div className="hidden md:flex p-6 items-center mb-2">
           <span className="text-[#f38ba8] font-bold text-2xl font-sans tracking-tight">▲ 10xCS</span>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {menuItems.map((item, idx) => {
            // Checks if the tab is currently active to highlight it
            const isActive = activeTab === item.tabId;
            
            return (
              <button 
                key={idx} 
                onClick={() => {
                  // Simplified your tab switching logic
                  if (item.tabId) {
                    setActiveTab(item.tabId);
                    // Only close the sidebar if the user is on a mobile device
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }
                }}
                className={`w-full flex items-center space-x-4 p-3 rounded-lg border border-transparent transition-all group ${
                  isActive 
                    ? 'bg-[#1a2322] border-[#313244] text-[#f38ba8]' 
                    : 'hover:bg-[#1a2322] hover:text-[#f38ba8]'
                }`}
              >
                <item.icon 
                  className={isActive ? 'text-[#f38ba8]' : 'text-[#89dceb] group-hover:text-[#f38ba8] transition-colors'} 
                  size={20} 
                />
                <span className={`font-semibold text-sm transition-colors ${isActive ? 'text-[#f38ba8]' : 'text-[#bac2de] group-hover:text-[#f38ba8]'}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Sleek Upgrade Button at the Bottom */}
        <div className="p-4 border-t border-[#313244] bg-[#111818]">
          <button className="w-full flex items-center justify-center space-x-2 bg-[#1a2322] text-[#bac2de] border border-[#313244] p-3 rounded-lg font-semibold text-sm hover:bg-[#313244]/50 hover:text-[#f38ba8] hover:border-[#f38ba8]/50 transition-all">
            <Zap size={18} className="text-[#f38ba8]" />
            <span>Upgrade to PRO</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;