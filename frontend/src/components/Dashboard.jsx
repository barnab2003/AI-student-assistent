import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { CheckCircle, Circle, Flame, Trophy, Sparkles, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';

const Dashboard = () => {
  // --- 1. STATE VARIABLES ---
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [genParams, setGenParams] = useState({ track: '', daysToComplete: 30 });
  const [isRecalculating, setIsRecalculating] = useState(false);

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'roadmap', 'community'
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newCommentText, setNewCommentText] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostText, setEditPostText] = useState('');
  // --- 2. INITIAL DATA FETCH ---
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

  // --- 3. COMMUNITY WEBSOCKETS ---
  useEffect(() => {
    if (activeTab === 'community') {
      fetchPosts();

      const socket = io('http://localhost:5000');

      socket.on('receive_new_post', (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      });

      socket.on('receive_new_comment', (updatedPost) => {
        setPosts((prevPosts) => 
          prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post)
        );
      });
      // ... existing socket listeners ...
      
      socket.on('post_deleted', (deletedPostId) => {
        setPosts((prevPosts) => prevPosts.filter(p => p._id !== deletedPostId));
      });

      socket.on('post_updated', (updatedPost) => {
        setPosts((prevPosts) => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data);
    } catch (err) { console.error(err); }
  };

  // --- 4. HANDLER FUNCTIONS ---
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

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await api.post('/roadmap/generate', genParams);
      setRoadmap(response.data);
    } catch (error) {
      console.error("Error generating roadmap", error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecalculate = async () => {
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !imageFile) return;
    
    try {
      let uploadedImageUrl = null;
      
      // If there is an image, upload it to the new route first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      // Create the post with the text and the new image URL
      await api.post('/community/post', { 
        text: newPostText,
        mediaUrl: uploadedImageUrl 
      });
      
      setNewPostText('');
      setImageFile(null); // Reset the file input
    } catch (err) { console.error(err); }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/community/post/${postId}`);
      } catch (err) { console.error(err); }
    }
  };

  const submitEditPost = async (postId) => {
    try {
      await api.put(`/community/post/${postId}`, { text: editPostText });
      setEditingPostId(null);
    } catch (err) { console.error(err); }
  };

  const handleCreateComment = async (postId) => {
    if (!newCommentText[postId]?.trim()) return;
    try {
      await api.post(`/community/comment/${postId}`, { text: newCommentText[postId] });
      setNewCommentText({ ...newCommentText, [postId]: '' });
    } catch (err) { console.error(err); }
  };

  // --- 5. RENDER UI ---
  if (loading) return <div className="p-10 text-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Global Header / Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 font-bold text-xl text-blue-600">
            <span>🚀 SmartStudy.cs</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {['home', 'roadmap', 'community'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Dynamic Core Views Wrapper */}
      <div className="max-w-6xl mx-auto p-6 mt-4">
        
        {/* 🏠 TAB 1: HOME PANEL */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Stats Widget */}
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
        )}

        {/* 🗺️ TAB 2: ROADMAP PANEL */}
        {activeTab === 'roadmap' && (
          <div className="max-w-4xl mx-auto">
            
            {/* Conditional: Do they need a roadmap, or do they already have one? */}
            {!roadmap || roadmap?.modules?.length === 0 ? (
              
              /* --- THE GENERATOR FORM --- */
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center mt-4">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Your AI Learning Path</h1>
                <p className="text-gray-500 mb-8">Tell us what you want to master, and our AI will build a day-by-day curriculum for you.</p>
                
                <form onSubmit={handleGenerateAI} className="space-y-6 text-left max-w-xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to learn?</label>
                    <input 
                      type="text" required placeholder="e.g., Python for Data Science, Advanced React..."
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={genParams.track}
                      onChange={(e) => setGenParams({...genParams, track: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">In how many days?</label>
                    <input 
                      type="number" required min="7" max="180"
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={genParams.daysToComplete}
                      onChange={(e) => setGenParams({...genParams, daysToComplete: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" disabled={isGenerating}
                    className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                  >
                    {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Generate My Roadmap'}
                  </button>
                </form>
              </div>

            ) : (

              /* --- THE ACTUAL ROADMAP CHECKLIST --- */
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-800">Your {roadmap.track} Roadmap</h1>
                  <button 
                    onClick={handleRecalculate}
                    disabled={isRecalculating}
                    className="flex items-center text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
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
                          className={`flex flex-col p-4 rounded-lg cursor-pointer transition-colors ${task.isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                          onClick={() => handleToggleTask(task.taskId, mod.moduleName)}
                        >
                          <div className="flex items-center w-full">
                            {task.isCompleted ? <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={24} /> : <Circle className="text-gray-300 mr-3 flex-shrink-0" size={24} />}
                            <span className={`flex-1 text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                            <span className="text-sm text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>

                          {/* Resource Badges */}
                          {task.resources && task.resources.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 ml-9" onClick={(e) => e.stopPropagation()}>
                              {task.resources.map((res, rIdx) => (
                                <a
                                  key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center text-xs font-semibold bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-2.5 py-1 rounded-md border border-gray-200 transition-colors"
                                >
                                  <span className="mr-1">📚</span> {res.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 👥 TAB 3: COMMUNITY PANEL */}
        {activeTab === 'community' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Create Post Interface Card */}
            <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                rows="3"
                placeholder="Share an insight, question, link, or progress picture..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                {/* Image Upload Input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all">
                  Publish Post
                </button>
              </div>
            </form>

            {/* Render The Community Social Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                  
                  {/* Top Row: User Info & Actions */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm border border-blue-100">
                        Lvl {post.userLevel}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">@{post.username}</h4>
                        <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Edit/Delete Dropdown logic (Only show if current user owns post) */}
                    {user && (user.id === post.userId || user._id === post.userId) && (
                      <div className="space-x-2 flex">
                        <button onClick={() => { setEditingPostId(post._id); setEditPostText(post.text); }} className="text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors">Edit</button>
                        <button onClick={() => handleDeletePost(post._id)} className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                  
                  {/* Edit Mode vs Normal View */}
                  {editingPostId === post._id ? (
                    <div className="space-y-2">
                      <textarea 
                        className="w-full p-3 border border-blue-300 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                        value={editPostText} 
                        onChange={(e) => setEditPostText(e.target.value)} 
                        rows="3"
                      />
                      <div className="space-x-2">
                        <button onClick={() => submitEditPost(post._id)} className="text-xs font-bold bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">Save Changes</button>
                        <button onClick={() => setEditingPostId(null)} className="text-xs font-bold bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-md leading-relaxed">{post.text}</p>
                  )}

                  {/* Render Image if it exists */}
                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt="Post attachment" className="rounded-lg max-h-96 w-full object-cover border border-gray-100 mt-2" />
                  )}
                  
                  {/* Embedded Threaded Comments Section */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100 mt-4">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Discussion Thread</h5>
                    
                    {post.comments && post.comments.map((comment, cIdx) => (
                      <div key={cIdx} className="text-sm border-l-2 border-gray-200 pl-3 py-1">
                        <span className="font-bold text-gray-800">@{comment.username}: </span>
                        <span className="text-gray-600">{comment.text}</span>
                      </div>
                    ))}
                    
                    {/* Inline Comment Form */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Write a comment..."
                        value={newCommentText[post._id] || ''}
                        onChange={(e) => setNewCommentText({ ...newCommentText, [post._id]: e.target.value })}
                      />
                      <button onClick={() => handleCreateComment(post._id)} className="bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 px-4 py-2 rounded-md font-bold text-xs text-gray-600 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;