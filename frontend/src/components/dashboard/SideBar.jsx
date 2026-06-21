import React from 'react';
import { X, Trophy, BrainCircuit, Medal, Settings, Zap } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, setActiveTab }) => { // <--- ADDED setActiveTab HERE
  const menuItems = [
    { name: 'Global Leaderboard', tabId: 'leaderboard', icon: Trophy, color: 'text-yellow-400' },
    { name: 'AI Quizzes', tabId: 'quizzes', icon: BrainCircuit, color: 'text-pink-400' },
    { name: 'My Badges', tabId: 'badges', icon: Medal, color: 'text-blue-400' },
    { name: 'Settings', tabId: 'settings', icon: Settings, color: 'text-gray-400' },
  ];

  return (
    <>
      {/* Dimmed Backdrop (Closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* The Offcanvas Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-[#191A23] border-r-4 border-black z-50 transform transition-transform duration-300 ease-in-out shadow-[8px_0px_0px_rgba(0,0,0,1)] flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Sidebar Header */}
        <div className="p-6 border-b-2 border-gray-800 flex justify-between items-center">
          <span className="text-[#B9FF66] font-black text-2xl tracking-tight">Features Menu</span>
          <button onClick={toggleSidebar} className="text-white hover:text-[#B9FF66] transition-colors p-1">
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {menuItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (item.tabId === 'leaderboard') {
                  setActiveTab('leaderboard');
                  toggleSidebar();
                }
                if (item.tabId === 'quizzes') {
                  setActiveTab('quizzes');
                  toggleSidebar();
                }
                if (item.tabId === 'badges') {
                  setActiveTab('badges');
                  toggleSidebar();
                }
              }}
              className="w-full flex items-center space-x-4 p-4 rounded-2xl border-2 border-transparent hover:border-[#B9FF66] hover:bg-white/5 group transition-all"
            >
              <item.icon className={item.color} size={24} />
              <span className="text-white font-bold group-hover:text-[#B9FF66] text-lg transition-colors">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Sticky Upgrade Button at the Bottom */}
        <div className="p-6 border-t-2 border-gray-800 bg-[#191A23]">
          <button className="w-full flex items-center justify-center space-x-2 bg-[#B9FF66] text-black border-2 border-black p-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Zap size={24} className="fill-black" />
            <span>Upgrade to PRO</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;