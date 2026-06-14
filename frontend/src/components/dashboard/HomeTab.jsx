import React from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Trophy, Flame, Edit2, Camera } from 'lucide-react';

const HomeTab = ({ 
  user, 
  roadmap, 
  isEditingProfile, 
  setIsEditingProfile, 
  editProfileData, 
  setEditProfileData, 
  handleUpdateProfile 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* User Stats & Profile Widget - Brutalist Redesign */}
      <div className="bg-[#191A23] p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col items-center relative text-white">
        
        {!isEditingProfile ? (
          <>
            <button onClick={() => { setEditProfileData({ username: user?.username, file: null }); setIsEditingProfile(true); }} className="absolute top-6 right-6 text-gray-300 hover:text-[#B9FF66] transition-colors">
              <Edit2 size={20} />
            </button>
            
            {/* Avatar Circle - Lime Accent */}
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-black font-black text-4xl mb-5 overflow-hidden border-4 border-[#B9FF66] shrink-0">
              {user?.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : user?.username?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-sm font-bold text-black bg-[#B9FF66] px-4 py-1.5 rounded-full mb-3">Level {user?.level || 1}</div>
            <h3 className="text-2xl font-bold">{user?.username}</h3>
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

        {/* Stats Section */}
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

      {/* Activity Logs Analytics Grid - Brutalist Redesign */}
      <div className="md:col-span-2 bg-[#B9FF66] p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <h3 className="text-sm font-black text-black uppercase mb-6 tracking-widest border-b-2 border-black pb-2 inline-block">Activity History</h3>
        <div className="mt-2">
          <ActivityCalendar 
            data={roadmap?.dailyActivityLog?.length > 0 ? roadmap.dailyActivityLog : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
            theme={{ light: ['#ebedf0', '#d9f9b1', '#b9ff66', '#8cc63f', '#5e8a29'] }} // Custom Lime Theme
            hideColorLegend
          />
        </div>
      </div>

    </div>
  );
};

export default HomeTab;