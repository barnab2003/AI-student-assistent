import React from 'react';
import { Medal, Zap, Flame, BrainCircuit, Target, Star, Lock } from 'lucide-react';

const BadgesTab = ({ currentUser }) => {
  // Master list of all available badges in the game
  const allBadges = [
    { id: 'first_login', name: 'Hello World', desc: 'Log into SmartStudy for the first time.', icon: Star, color: 'bg-[#FF90E8]' },
    { id: 'streak_7', name: 'Consistency King', desc: 'Maintain a 7-day learning streak.', icon: Flame, color: 'bg-[#FFC900]' },
    { id: 'xp_500', name: 'Grindset', desc: 'Accumulate 500 total XP.', icon: Zap, color: 'bg-[#B9FF66]' },
    { id: 'quiz_flawless', name: 'Big Brain', desc: 'Score 100% on an AI-generated quiz.', icon: BrainCircuit, color: 'bg-[#FF90E8]' },
    { id: 'roadmap_finish', name: 'Completionist', desc: 'Finish 100% of an AI learning roadmap.', icon: Target, color: 'bg-[#B9FF66]' },
    { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Like 10 community posts.', icon: Medal, color: 'bg-[#FFC900]' },
  ];

  // Fallback in case currentUser isn't fully loaded yet
  const userBadges = currentUser?.badges || ['first_login'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 font-mono text-[#bac2de]">
      
      {/* Header Banner */}
      <div className="bg-[#111818] p-8 md:p-12 rounded-2xl border border-[#313244] shadow-lg relative overflow-hidden">
        {/* Faded Background Icon */}
        <Medal className="absolute -bottom-10 -right-10 text-[#1a2322] opacity-80 w-64 h-64 rotate-12" />
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Your <span className="text-[#f38ba8]">Trophy Room</span>
          </h1>
          <p className="text-[#bac2de]/70 font-medium text-sm md:text-base max-w-xl">
            Complete milestones to unlock these digital badges. Flex them on the global leaderboard.
          </p>
          
          <div className="mt-6 inline-flex items-center space-x-3 bg-[#1a2322] border border-[#313244] px-4 py-2 rounded-lg">
            <span className="text-[#89dceb] font-bold text-xl">{userBadges.length}</span>
            <span className="text-[#bac2de]/50 font-semibold text-xs uppercase tracking-widest">
              / {allBadges.length} Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges.map((badge) => {
          const isUnlocked = userBadges.includes(badge.id);

          return (
            <div 
              key={badge.id} 
              className={`p-6 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col group ${
                isUnlocked 
                  ? 'bg-[#111818] border-[#313244] shadow-md hover:-translate-y-1 hover:border-[#89dceb]/50' 
                  : 'bg-[#1a2322]/40 border-dashed border-[#313244] opacity-60 grayscale'
              }`}
            >
              {/* Lock Overlay for locked badges */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4 bg-[#111818] p-2 rounded-lg border border-[#313244]">
                  <Lock size={16} className="text-[#bac2de]/40" strokeWidth={2} />
                </div>
              )}

              {/* Badge Icon Box */}
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center border mb-5 transition-colors ${
                isUnlocked 
                  ? `${badge.color} border-[#313244] shadow-sm` // Keeps your original badge.color variable
                  : 'bg-[#111818] border-[#313244] shadow-none'
              }`}>
                <badge.icon 
                  size={28} 
                  className={isUnlocked ? 'text-[#111818] opacity-90' : 'text-[#bac2de]/30'} 
                  strokeWidth={2} 
                />
              </div>
              
              <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-[#bac2de]/50'}`}>
                {badge.name}
              </h3>
              
              <p className={`text-sm leading-relaxed flex-1 ${isUnlocked ? 'text-[#bac2de]/80' : 'text-[#bac2de]/40'}`}>
                {badge.desc}
              </p>

              {/* Progress Bar Mockup (Visible only when locked) */}
              {!isUnlocked && (
                <div className="mt-5 h-1.5 w-full bg-[#111818] rounded-full overflow-hidden">
                  {/* You can make the width dynamic later based on actual user progress */}
                  <div className="h-full bg-[#313244] w-1/3 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default BadgesTab;