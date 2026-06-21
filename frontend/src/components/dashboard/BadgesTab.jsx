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
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-[#191A23] p-8 md:p-12 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
        <Medal className="absolute -bottom-10 -right-10 text-gray-800 opacity-30 w-64 h-64 rotate-12" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Your <span className="text-[#FFC900]">Trophy Room</span></h1>
          <p className="text-gray-400 font-bold text-lg max-w-xl">Complete milestones to unlock these digital badges. Flex them on the global leaderboard.</p>
          
          <div className="mt-6 inline-flex items-center space-x-2 bg-black border-2 border-gray-700 px-4 py-2 rounded-xl">
            <span className="text-[#FFC900] font-black text-xl">{userBadges.length}</span>
            <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">/ {allBadges.length} Unlocked</span>
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
              className={`p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${
                isUnlocked 
                  ? 'bg-white border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-2' 
                  : 'bg-gray-50 border-dashed border-gray-400 opacity-70 grayscale'
              }`}
            >
              {/* Lock Overlay for locked badges */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full border-2 border-gray-400">
                  <Lock size={16} className="text-gray-500" strokeWidth={3} />
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 ${
                isUnlocked ? badge.color : 'bg-gray-200 shadow-none'
              }`}>
                <badge.icon size={32} className={isUnlocked ? 'text-black' : 'text-gray-400'} strokeWidth={2.5} />
              </div>
              
              <h3 className={`text-xl font-black mb-2 ${isUnlocked ? 'text-black' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              
              <p className={`font-medium ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {badge.desc}
              </p>

              {/* Progress Bar Mockup (Optional UI flair) */}
              {!isUnlocked && (
                <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 w-1/3"></div>
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