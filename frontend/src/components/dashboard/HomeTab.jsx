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
      {/* User Stats & Profile Widget */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative">
        {!isEditingProfile ? (
          <>
            <button onClick={() => { setEditProfileData({ username: user?.username, file: null }); setIsEditingProfile(true); }} className="absolute top-4 right-4 text-gray-400 hover:text-blue-600">
              <Edit2 size={18} />
            </button>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-4 overflow-hidden border-4 border-blue-50 shrink-0">
              {user?.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">Level {user?.level || 1}</div>
            <h3 className="text-xl font-bold text-gray-800">{user?.username}</h3>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile} className="w-full space-y-4 text-center">
            <div className="relative w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
              {editProfileData.file ? (
                <img src={URL.createObjectURL(editProfileData.file)} alt="Preview" className="w-full h-full object-cover" />
              ) : user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="text-gray-400" size={32} />
              )}
              <input type="file" accept="image/*" onChange={(e) => setEditProfileData({...editProfileData, file: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-xs text-gray-500">Tap to change picture</p>
            <input type="text" value={editProfileData.username} onChange={(e) => setEditProfileData({...editProfileData, username: e.target.value})} className="w-full p-2 border rounded-lg text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Username" required />
            <div className="flex space-x-2 justify-center">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Save</button>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </form>
        )}

        <div className="flex w-full justify-between mt-6 px-4">
          <div className="text-center">
            <Trophy className="mx-auto text-yellow-500 mb-1" size={20} />
            <p className="text-xs text-gray-500 uppercase font-bold">Total XP</p>
            <p className="font-semibold text-lg">{user?.xp || 0}</p>
          </div>
          <div className="text-center">
            <Flame className="mx-auto text-orange-500 mb-1" size={20} />
            <p className="text-xs text-gray-500 uppercase font-bold">Streak</p>
            <p className="font-semibold text-lg">{user?.streak || 0} Days</p>
          </div>
        </div>
      </div>

      {/* Activity Logs Analytics Grid */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">Activity History Calendar</h3>
        <ActivityCalendar 
          data={roadmap?.dailyActivityLog?.length > 0 ? roadmap.dailyActivityLog : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
          theme={{ light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] }}
          hideColorLegend
        />
      </div>
    </div>
  );
};

export default HomeTab;