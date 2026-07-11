import React from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Trophy, Flame, Edit2, Camera, Bot, Users, Gamepad2, Code, MessageCircle, Mail } from 'lucide-react';

const HomeTab = ({ 
  user, 
  roadmap, 
  isEditingProfile, 
  setIsEditingProfile, 
  editProfileData, 
  setEditProfileData, 
  handleUpdateProfile 
}) => {

  // Data for the scrolling info blocks
  const infoBlocks = [
    { 
      title: "AI-Powered Roadmaps", 
      desc: "Generate custom, day-by-day learning paths tailored to your exact goals—perfect for long-term exam prep or mastering a new tech stack.", 
      icon: Bot, 
      color: "bg-[#FF90E8]" // Neo-Pink
    },
    { 
      title: "Developer Community", 
      desc: "Connect with other engineering students, share your daily progress, debate tech stacks, and get unstuck together.", 
      icon: Users, 
      color: "bg-[#B9FF66]" // Electric Lime
    },
    { 
      title: "Gamified Progression", 
      desc: "Earn XP, maintain your coding streak, and build a verifiable history of your hard work to stay motivated.", 
      icon: Gamepad2, 
      color: "bg-[#FFC900]" // Warning Yellow
    }
  ];

  return (
    <div className="space-y-10 pb-8 font-mono text-[#bac2de]">
      
      {/* --- TOP SECTION: DASHBOARD WIDGETS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Stats & Profile Widget */}
        <div className="bg-[#111818] p-8 rounded-2xl border border-[#313244] shadow-lg flex flex-col items-center relative text-[#bac2de]">
          {!isEditingProfile ? (
            <>
              <button 
                onClick={() => { setEditProfileData({ username: user?.username, file: null }); setIsEditingProfile(true); }} 
                className="absolute top-4 right-4 text-[#bac2de]/60 hover:text-[#f38ba8] transition-colors p-2"
              >
                <Edit2 size={18} />
              </button>
              
              <div className="w-28 h-28 bg-[#1a2322] rounded-full flex items-center justify-center text-[#89dceb] font-bold text-4xl mb-5 overflow-hidden border border-[#313244] shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="text-xs font-semibold text-[#89dceb] bg-[#1a2322] border border-[#313244] px-4 py-1 rounded-md mb-3">
                Level {user?.level || 1}
              </div>
              <h3 className="text-xl font-bold truncate max-w-full text-white">{user?.username}</h3>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="w-full space-y-5 text-center">
              <div className="relative w-24 h-24 mx-auto bg-[#1a2322] rounded-full flex items-center justify-center overflow-hidden border border-[#f38ba8]">
                {editProfileData.file ? (
                  <img src={URL.createObjectURL(editProfileData.file)} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-[#bac2de]/50" size={32} />
                )}
                <input type="file" accept="image/*" onChange={(e) => setEditProfileData({...editProfileData, file: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <p className="text-xs text-[#bac2de]/50">Tap to change picture</p>
              
              <input 
                type="text" 
                value={editProfileData.username} 
                onChange={(e) => setEditProfileData({...editProfileData, username: e.target.value})} 
                className="w-full p-3 border border-[#313244] bg-[#1a2322] text-[#bac2de] rounded-lg text-center outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] transition-all" 
                placeholder="New Username" 
                required 
              />
              
              <div className="flex space-x-3 justify-center">
                <button type="submit" className="bg-[#f38ba8] text-[#111818] px-5 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">Save</button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-[#1a2322] text-[#bac2de] border border-[#313244] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#313244]/50 transition-all">Cancel</button>
              </div>
            </form>
          )}

          <div className="flex w-full justify-between mt-8 px-4 pt-6 border-t border-[#313244]">
            <div className="text-center">
              <Trophy className="mx-auto text-[#f38ba8] mb-2" size={20} />
              <p className="text-[10px] text-[#89dceb] uppercase font-bold tracking-wider">Total XP</p>
              <p className="font-bold text-lg text-white">{user?.xp || 0}</p>
            </div>
            <div className="text-center">
              <Flame className="mx-auto text-[#f38ba8] mb-2" size={20} />
              <p className="text-[10px] text-[#89dceb] uppercase font-bold tracking-wider">Streak</p>
              <p className="font-bold text-lg text-white">{user?.streak || 0} Days</p>
            </div>
          </div>
        </div>

        {/* GitHub-Style Activity Calendar */}
        <div className="md:col-span-2 bg-[#111818] p-8 rounded-2xl border border-[#313244] shadow-lg flex flex-col justify-center overflow-x-auto">
          <div className="flex justify-between items-end mb-6 border-b border-[#313244] pb-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Contribution Graph</h3>
            <span className="text-xs font-semibold text-[#89dceb]">Last 365 Days</span>
          </div>
          <div className="mt-2 min-w-max">
            <ActivityCalendar 
              data={roadmap?.dailyActivityLog?.length > 0 ? roadmap.dailyActivityLog : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
              // Custom Cyber-Zen Cyan Theme
              theme={{ 
                light: ['#1a2322', '#203635', '#2c5957', '#428f8c', '#89dceb'],
                dark: ['#1a2322', '#203635', '#2c5957', '#428f8c', '#89dceb'] 
              }} 
              blockSize={14}
              blockRadius={3}
              blockMargin={4}
              fontSize={12}
            />
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: INFO BLOCKS --- */}
      <div className="bg-[#111818] p-8 md:p-10 rounded-2xl border border-[#313244] shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Why Use <span className="text-[#f38ba8]">10xCS?</span>
          </h2>
          <p className="text-[#bac2de]/70 text-sm max-w-2xl mx-auto">
            The ultimate self-hosted interface designed to turn your long-term coding goals into actionable, daily habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoBlocks.map((block, idx) => (
            <div key={idx} className="bg-[#1a2322] p-6 rounded-xl border border-[#313244] shadow-md hover:border-[#89dceb]/50 hover:-translate-y-1 transition-all flex flex-col items-start group">
              <div className="p-3 rounded-lg border border-[#313244] bg-[#111818] mb-5 text-[#89dceb] group-hover:text-[#f38ba8] transition-colors">
                <block.icon size={24} strokeWidth={2} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{block.title}</h4>
              <p className="text-[#bac2de]/70 text-sm leading-relaxed">{block.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM SECTION: FOOTER --- */}
      <footer className="bg-[#111818] p-8 md:p-10 rounded-2xl border border-[#313244] shadow-lg text-[#bac2de] mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand & Copyright */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start space-x-2 font-bold text-2xl font-sans tracking-tight mb-1">
            <span className="text-[#f38ba8]">▲ 10xCS</span>
          </div>
          <p className="text-[#bac2de]/50 text-xs">© {new Date().getFullYear()} 10xCS. All rights reserved.</p>
          <p className="text-[#89dceb] text-[10px] uppercase tracking-widest mt-1">Yours for the voyage.</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="#" title="GitHub" className="p-3 bg-[#1a2322] text-[#89dceb] border border-[#313244] rounded-lg hover:border-[#f38ba8] hover:text-[#f38ba8] transition-all">
            <Code size={18} />
          </a>
          <a href="#" title="Community" className="p-3 bg-[#1a2322] text-[#89dceb] border border-[#313244] rounded-lg hover:border-[#f38ba8] hover:text-[#f38ba8] transition-all">
            <MessageCircle size={18} />
          </a>
          <a href="#" title="Contact" className="p-3 bg-[#1a2322] text-[#89dceb] border border-[#313244] rounded-lg hover:border-[#f38ba8] hover:text-[#f38ba8] transition-all">
            <Mail size={18} />
          </a>
        </div>
        
      </footer>

    </div>
  );
};

export default HomeTab;