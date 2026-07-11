import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Medal, Loader2 } from 'lucide-react';
import axios from 'axios'; // Use your standard api import if different!

const LeaderboardTab = ({ currentUser }) => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Adjust the URL if your backend is hosted elsewhere!
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/leaderboard`);
        setLeaders(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-black" size={48} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 font-mono text-[#bac2de]">
      
      {/* Header Banner */}
      <div className="bg-[#111818] p-8 md:p-12 rounded-2xl border border-[#313244] shadow-lg text-center relative overflow-hidden">
        <Trophy className="absolute -top-10 -right-10 text-[#1a2322] opacity-80 w-48 h-48 rotate-12" />
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight relative z-10 text-white">
          <span className="text-[#89dceb]">Global</span> Rankings
        </h1>
        <p className="text-[#bac2de]/70 font-medium text-sm md:text-base relative z-10">
          Grind XP, maintain your streak, and climb to the top.
        </p>
      </div>

      {/* The Leaderboard List */}
      <div className="space-y-4">
        {leaders.map((user, index) => {
          
          // Custom styling for Top 3 (Cyber-Zen variations)
          let rankStyle = "bg-[#111818] border-[#313244] shadow-sm";
          let rankNumberColor = "text-[#bac2de]/50";
          let badgeColor = "bg-[#1a2322] text-[#bac2de] border-[#313244]";
          
          if (index === 0) {
            rankStyle = "bg-[#1a2322] border-[#f38ba8] shadow-md scale-[1.02] z-30 relative"; // 1st Place (Coral Pink)
            rankNumberColor = "text-[#f38ba8] drop-shadow-[0_0_8px_rgba(243,139,168,0.5)]";
            badgeColor = "bg-[#111818] text-[#f38ba8] border-[#f38ba8]/50";
          } else if (index === 1) {
            rankStyle = "bg-[#1a2322] border-[#89dceb] shadow-md scale-[1.01] z-20 relative"; // 2nd Place (Soft Cyan)
            rankNumberColor = "text-[#89dceb] drop-shadow-[0_0_8px_rgba(137,220,235,0.5)]";
            badgeColor = "bg-[#111818] text-[#89dceb] border-[#89dceb]/50";
          } else if (index === 2) {
            rankStyle = "bg-[#1a2322] border-[#bac2de]/50 shadow-sm z-10 relative"; // 3rd Place (Bright Slate)
            rankNumberColor = "text-[#bac2de]";
            badgeColor = "bg-[#111818] text-[#bac2de] border-[#bac2de]/30";
          }

          const isMe = currentUser?.username === user.username;

          return (
            <div key={user._id} className={`p-4 md:p-6 rounded-xl flex items-center justify-between transition-all hover:-translate-y-1 border ${rankStyle} ${isMe ? 'ring-1 ring-[#89dceb]' : ''}`}>
              
              <div className="flex items-center space-x-4 md:space-x-6 min-w-0">
                {/* Rank Number */}
                <div className="w-8 md:w-12 text-center shrink-0">
                  <span className={`text-2xl md:text-3xl font-bold ${rankNumberColor}`}>{index + 1}</span>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#111818] rounded-full flex items-center justify-center font-bold text-[#89dceb] text-sm md:text-base border border-[#313244] overflow-hidden shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Username & Level */}
                <div className="min-w-0 flex-1">
                  <h3 className={`text-lg md:text-xl font-bold truncate flex items-center gap-2 ${index < 3 ? 'text-white' : 'text-[#bac2de]'}`}>
                    {user.username} 
                    {isMe && <span className="text-[10px] bg-[#89dceb] text-[#111818] px-2 py-0.5 rounded-md uppercase tracking-widest hidden md:inline-block">You</span>}
                  </h3>
                  <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded-md border ${badgeColor}`}>
                    Lvl {user.level}
                  </span>
                </div>
              </div>

              {/* Stats (XP & Streak) */}
              <div className="flex items-center space-x-4 md:space-x-8 shrink-0 text-right">
                <div className="hidden sm:block">
                  <Flame className={`inline-block mr-1 mb-1 ${index < 3 ? 'text-[#f38ba8]' : 'text-[#bac2de]/50'}`} size={18} />
                  <span className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-[#bac2de]'}`}>{user.streak}</span>
                  <span className="text-[10px] font-semibold uppercase block -mt-1 opacity-50">Streak</span>
                </div>
                <div>
                  <Medal className={`inline-block mr-1 mb-1 ${index < 3 ? 'text-[#89dceb]' : 'text-[#bac2de]/50'}`} size={18} />
                  <span className={`font-bold text-xl md:text-2xl ${index < 3 ? 'text-white' : 'text-[#bac2de]'}`}>{user.xp}</span>
                  <span className="text-[10px] font-semibold uppercase block -mt-1 opacity-50">Total XP</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardTab;