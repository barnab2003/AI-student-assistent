import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { CheckCircle, Circle, Flame, Trophy } from 'lucide-react';

const Dashboard = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Assuming you saved the user object to localStorage on login
      const localUser = JSON.parse(localStorage.getItem('user'));
      setUser(localUser);

      const response = await api.get('/roadmap');
      setRoadmap(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, moduleName) => {
    try {
      // Optimistic UI Update: Instantly toggle locally for a snappy feel
      const updatedModules = roadmap.modules.map(mod => {
        if (mod.moduleName === moduleName) {
          return {
            ...mod,
            tasks: mod.tasks.map(task => 
              task.taskId === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
          };
        }
        return mod;
      });
      setRoadmap({ ...roadmap, modules: updatedModules });

      // Send update to backend
      const response = await api.post('/roadmap/toggle-task', { taskId, moduleName });
      
      // Sync with real backend state (XP, exact grid data, etc.)
      setRoadmap(response.data.roadmap);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Update local storage

    } catch (error) {
      console.error("Error toggling task", error);
      // Revert if failed (omitted for brevity, but good practice)
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your roadmap...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
      
      {/* Left Column: The Roadmap Tasks */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Your {roadmap.track} Roadmap</h1>
        
        {roadmap.modules.map((mod, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">{mod.moduleName}</h2>
            <ul className="space-y-3">
              {mod.tasks.map((task) => (
                <li 
                  key={task.taskId} 
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${task.isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleToggleTask(task.taskId, mod.moduleName)}
                >
                  {task.isCompleted ? (
                    <CheckCircle className="text-green-500 mr-3" size={24} />
                  ) : (
                    <Circle className="text-gray-300 mr-3" size={24} />
                  )}
                  <span className={`flex-1 text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Right Column: Gamification & Stats */}
      <div className="space-y-6">
        {/* User Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
            Lvl {user?.level || 1}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{user?.username}</h3>
          
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

        {/* Contribution Graph Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">Activity History</h3>
          <ActivityCalendar 
            data={roadmap.dailyActivityLog.length > 0 ? roadmap.dailyActivityLog : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            }}
            labels={{
              totalCount: `{{count}} tasks completed in the last year`,
            }}
            hideColorLegend
          />
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;