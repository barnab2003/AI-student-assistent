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
        const res = await axios.get('http://localhost:5000/api/auth/leaderboard');
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
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-[#191A23] p-8 md:p-12 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center text-white relative overflow-hidden">
        <Trophy className="absolute -top-10 -right-10 text-gray-800 opacity-50 w-48 h-48 rotate-12" />
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight relative z-10"><span className="text-[#B9FF66]">Global</span> Rankings</h1>
        <p className="text-gray-400 font-bold text-lg relative z-10">Grind XP, maintain your streak, and climb to the top.</p>
      </div>

      {/* The Leaderboard List */}
      <div className="space-y-4">
        {leaders.map((user, index) => {
          
          // Custom styling for Top 3
          let rankStyle = "bg-white text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]";
          let badgeColor = "bg-gray-100 text-gray-600 border-black";
          
          if (index === 0) {
            rankStyle = "bg-[#FFD700] text-black border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] scale-[1.02] z-30 relative"; // Gold
            badgeColor = "bg-white text-yellow-600 border-black";
          } else if (index === 1) {
            rankStyle = "bg-[#E3E4E5] text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] scale-[1.01] z-20 relative"; // Silver
            badgeColor = "bg-white text-gray-600 border-black";
          } else if (index === 2) {
            rankStyle = "bg-[#CD7F32] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] z-10 relative"; // Bronze
            badgeColor = "bg-white text-orange-800 border-black";
          }

          const isMe = currentUser?.username === user.username;

          return (
            <div key={user._id} className={`p-4 md:p-6 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 ${rankStyle} ${isMe ? 'ring-4 ring-black ring-offset-2' : ''}`}>
              
              <div className="flex items-center space-x-4 md:space-x-6 min-w-0">
                {/* Rank Number */}
                <div className="w-8 md:w-12 text-center shrink-0">
                  <span className="text-2xl md:text-3xl font-black">{index + 1}</span>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center font-black text-black text-sm md:text-base border-2 border-black overflow-hidden shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Username & Level */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl md:text-2xl font-black truncate flex items-center gap-2">
                    {user.username} 
                    {isMe && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-md uppercase tracking-widest hidden md:inline-block">You</span>}
                  </h3>
                  <span className={`text-xs md:text-sm font-bold mt-1 inline-block px-2 py-0.5 rounded-md border-2 ${badgeColor}`}>
                    Lvl {user.level}
                  </span>
                </div>
              </div>

              {/* Stats (XP & Streak) */}
              <div className="flex items-center space-x-4 md:space-x-8 shrink-0 text-right">
                <div className="hidden sm:block">
                  <Flame className="inline-block text-red-500 mr-1 mb-1" size={20} strokeWidth={3} />
                  <span className="font-black text-lg">{user.streak}</span>
                  <span className="text-xs font-bold uppercase block -mt-1 opacity-80">Streak</span>
                </div>
                <div>
                  <Medal className="inline-block text-blue-500 mr-1 mb-1" size={20} strokeWidth={3} />
                  <span className="font-black text-xl md:text-2xl">{user.xp}</span>
                  <span className="text-xs font-bold uppercase block -mt-1 opacity-80">Total XP</span>
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