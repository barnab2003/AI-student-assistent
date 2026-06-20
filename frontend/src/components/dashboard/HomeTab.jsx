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
    <div className="space-y-12 pb-8">
      
      {/* --- TOP SECTION: DASHBOARD WIDGETS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Stats & Profile Widget */}
        <div className="bg-[#191A23] p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col items-center relative text-white">
          {!isEditingProfile ? (
            <>
              <button onClick={() => { setEditProfileData({ username: user?.username, file: null }); setIsEditingProfile(true); }} className="absolute top-6 right-6 text-gray-300 hover:text-[#B9FF66] transition-colors">
                <Edit2 size={20} />
              </button>
              
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-black font-black text-4xl mb-5 overflow-hidden border-4 border-[#B9FF66] shrink-0">
                {user?.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : user?.username?.charAt(0).toUpperCase()}
              </div>
              
              <div className="text-sm font-bold text-black bg-[#B9FF66] px-4 py-1.5 rounded-full mb-3">Level {user?.level || 1}</div>
              <h3 className="text-2xl font-bold truncate max-w-full">{user?.username}</h3>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="w-full space-y-5 text-center">
              <div className="relative w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#B9FF66]">
                {editProfileData.file ? (
                  <img src={URL.createObjectURL(editProfileData.file)} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-400" size={32} />
                )}
                <input type="file" accept="image/*" onChange={(e) => setEditProfileData({...editProfileData, file: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <p className="text-xs text-gray-400">Tap to change picture</p>
              <input type="text" value={editProfileData.username} onChange={(e) => setEditProfileData({...editProfileData, username: e.target.value})} className="w-full p-2 border-2 border-[#B9FF66] bg-transparent text-white rounded-lg text-center outline-none focus:ring-2 focus:ring-[#B9FF66]" placeholder="New Username" required />
              <div className="flex space-x-2 justify-center">
                <button type="submit" className="bg-[#B9FF66] text-black border-2 border-black px-4 py-2 rounded-lg text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all">Save</button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-700 text-white border-2 border-black px-4 py-2 rounded-lg text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</button>
              </div>
            </form>
          )}

          <div className="flex w-full justify-between mt-8 px-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <Trophy className="mx-auto text-[#B9FF66] mb-2" size={24} />
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total XP</p>
              <p className="font-black text-xl">{user?.xp || 0}</p>
            </div>
            <div className="text-center">
              <Flame className="mx-auto text-[#B9FF66] mb-2" size={24} />
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Streak</p>
              <p className="font-black text-xl">{user?.streak || 0} Days</p>
            </div>
          </div>
        </div>

        {/* GitHub-Style Activity Calendar */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-center overflow-x-auto">
          <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-3">
            <h3 className="text-2xl font-black text-black tracking-tight">Contribution Graph</h3>
            <span className="text-sm font-bold text-gray-500">Last 365 Days</span>
          </div>
          <div className="mt-2 min-w-max">
            <ActivityCalendar 
              data={roadmap?.dailyActivityLog?.length > 0 ? roadmap.dailyActivityLog : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
              // Authentic GitHub Green Theme
              theme={{ light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] }} 
              blockSize={16}
              blockRadius={4}
              blockMargin={5}
              fontSize={14}
            />
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: INFO BLOCKS --- */}
      <div className="bg-white p-10 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-black tracking-tight mb-4">Why Use <span className="text-[#B9FF66] bg-black px-3 py-1 rounded-xl shadow-[4px_4px_0px_rgba(185,255,102,1)]">SmartStudy?</span></h2>
          <p className="text-gray-600 font-bold text-lg max-w-2xl mx-auto">The ultimate platform designed to turn your long-term coding goals into actionable, daily habits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoBlocks.map((block, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-start">
              <div className={`p-4 rounded-xl border-2 border-black ${block.color} shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-6`}>
                <block.icon size={32} className="text-black" strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-black text-black mb-3">{block.title}</h4>
              <p className="text-gray-600 font-medium leading-relaxed">{block.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM SECTION: FOOTER --- */}
      <footer className="bg-[#191A23] p-10 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand & Copyright */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start space-x-2 font-black text-2xl tracking-tight mb-2">
            <span className="text-3xl text-[#B9FF66] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"></span>
            <span>10x.CS</span>
          </div>
          <p className="text-gray-400 font-medium text-sm">© {new Date().getFullYear()} SmartStudy. All rights reserved.</p>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Built for the next generation of engineers.</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="#" title="GitHub" className="p-3 bg-white text-black border-2 border-black rounded-full hover:bg-[#B9FF66] hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
            <Code size={20} strokeWidth={2.5} />
          </a>
          <a href="#" title="Community Discord/Twitter" className="p-3 bg-white text-black border-2 border-black rounded-full hover:bg-[#FF90E8] hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
            <MessageCircle size={20} strokeWidth={2.5} />
          </a>
          <a href="#" title="Contact Us" className="p-3 bg-white text-black border-2 border-black rounded-full hover:bg-[#FFC900] hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
            <Mail size={20} strokeWidth={2.5} />
          </a>
        </div>
        
      </footer>

    </div>
  );
};

export default HomeTab;