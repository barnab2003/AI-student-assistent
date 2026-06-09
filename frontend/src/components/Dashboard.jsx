import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { CheckCircle, Circle, Flame, Trophy, Sparkles, Loader2 } from 'lucide-react';



const Dashboard = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  // New States for AI Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [genParams, setGenParams] = useState({ track: '', daysToComplete: 30 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
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
      // Optimistic UI Update
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

      const response = await api.post('/roadmap/toggle-task', { taskId, moduleName });
      
      setRoadmap(response.data.roadmap);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));

    } catch (error) {
      console.error("Error toggling task", error);
    }
  };

  // NEW: Function to call the Gemini AI Route
  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await api.post('/roadmap/generate', genParams);
      setRoadmap(response.data); // Update UI with the brand new AI roadmap
    } catch (error) {
      console.error("Error generating roadmap", error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecalculate = async () => {
  // Let the user confirm they want to shift their dates
  const newDays = prompt("How many days do you need to complete the remaining tasks?", "14");
  if (!newDays) return;

  setIsRecalculating(true);
  try {
    const response = await api.post('/roadmap/recalculate', { newDaysToComplete: parseInt(newDays) });
    setRoadmap(response.data);
  } catch (error) {
    console.error("Error recalculating roadmap", error);
    alert("Failed to re-route plan. Please try again.");
  } finally {
    setIsRecalculating(false);
  }
};

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your profile...</div>;

  // NEW: The Empty State / AI Generation View
  if (!roadmap || roadmap.modules.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Your AI Learning Path</h1>
        <p className="text-gray-500 mb-8">Tell us what you want to master, and our AI will build a day-by-day curriculum for you.</p>
        
        <form onSubmit={handleGenerateAI} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to learn?</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Python for Data Science, Advanced React..."
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={genParams.track}
              onChange={(e) => setGenParams({...genParams, track: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">In how many days?</label>
            <input 
              type="number" 
              required
              min="7"
              max="180"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={genParams.daysToComplete}
              onChange={(e) => setGenParams({...genParams, daysToComplete: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin mr-2" size={20} /> AI is crafting your syllabus...</>
            ) : (
              'Generate My Roadmap'
            )}
          </button>
        </form>
      </div>
    );
  }

  // ... The rest of your existing Dashboard return statement goes here ...
  // (The 3-column layout with the tasks, user stats, and contribution grid)
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
      
      {/* Left Column: The Roadmap Tasks */}
      <div className="md:col-span-2 space-y-6">
        {/* NEW: Flex container holding both the Title and the Button */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Your {roadmap.track} Roadmap</h1>
          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            {isRecalculating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
            {isRecalculating ? "Re-routing..." : "Re-route Plan"}
          </button>
        </div>
        
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