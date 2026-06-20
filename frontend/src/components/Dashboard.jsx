import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { io } from 'socket.io-client';
import { CheckCircle, Circle, Flame, Trophy, Sparkles, Loader2, Search, Edit2, Camera } from 'lucide-react';
import Navbar from './dashboard/Navbar';
import Sidebar from './dashboard/Sidebar';
import HomeTab from './dashboard/HomeTab';
import RoadmapTab from './dashboard/RoadmapTab'; // <--- NEW IMPORT
import CommunityTab from './dashboard/CommunityTab';
import LeaderboardTab from './dashboard/LeaderboardTab';
import QuizTab from './dashboard/QuizTab';
const Dashboard = () => {
  // --- 1. STATE VARIABLES ---
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [genParams, setGenParams] = useState({ track: '', daysToComplete: 30 });
  const [isRecalculating, setIsRecalculating] = useState(false);

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'roadmap', 'community'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newCommentText, setNewCommentText] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostText, setEditPostText] = useState('');
  
  // New Feature States
  const [showGenerator, setShowGenerator] = useState(false); // For Roadmap regeneration
  const [searchQuery, setSearchQuery] = useState(''); // For Community Search
  const [isEditingProfile, setIsEditingProfile] = useState(false); // For Profile Editor
  const [editProfileData, setEditProfileData] = useState({ username: '', file: null });
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
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = user.profilePicture || ""; 
      
      // 1. Try to upload the image
      if (editProfileData.file) {
        console.log("Step 1: Uploading image to server...");
        const formData = new FormData();
        formData.append('image', editProfileData.file);
        
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("Upload Success! Image URL:", uploadRes.data.imageUrl);
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      // 2. Try to save the new data to the database
      console.log("Step 2: Saving profile to database...");
      const res = await api.put('/auth/profile', {
        username: editProfileData.username || user.username,
        profilePicture: uploadedImageUrl
      });

      // 3. Update the UI
      console.log("Step 3: Profile updated successfully!");
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditingProfile(false);
      fetchPosts(); 
      
    } catch (err) { 
      console.error("FULL ERROR:", err);
      // This will pop up a box on your screen telling us exactly what failed!
      alert("Save Failed: " + (err.response?.data?.message || err.message)); 
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
      
      {/* 0. Injected Offcanvas Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setActiveTab={setActiveTab} />

      {/* 1. Injected Navbar Component */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} toggleSidebar={toggleSidebar} />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
        
{/* 🏠 TAB 1: HOME PANEL */}
        {/* 2. Injected Home Tab Component */}
        {activeTab === 'home' && (
          <HomeTab 
            user={user} 
            roadmap={roadmap}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            editProfileData={editProfileData}
            setEditProfileData={setEditProfileData}
            handleUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* 🗺️ TAB 2: ROADMAP PANEL */}
        {activeTab === 'roadmap' && (
          <RoadmapTab 
            roadmap={roadmap}
            showGenerator={showGenerator}
            setShowGenerator={setShowGenerator}
            isGenerating={isGenerating}
            genParams={genParams}
            setGenParams={setGenParams}
            handleGenerateAI={handleGenerateAI}
            isRecalculating={isRecalculating}
            handleRecalculate={handleRecalculate}
            handleToggleTask={handleToggleTask}
          />
        )}

        {/* 👥 TAB 3: COMMUNITY PANEL */}
        {activeTab === 'community' && (
          <CommunityTab
            user={user}
            posts={posts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleCreatePost={handleCreatePost}
            newPostText={newPostText}
            setNewPostText={setNewPostText}
            setImageFile={setImageFile}
            editingPostId={editingPostId}
            setEditingPostId={setEditingPostId}
            editPostText={editPostText}
            setEditPostText={setEditPostText}
            submitEditPost={submitEditPost}
            handleDeletePost={handleDeletePost}
            newCommentText={newCommentText}
            setNewCommentText={setNewCommentText}
            handleCreateComment={handleCreateComment}
          />
        )}

        {/* 🏆 TAB 4: LEADERBOARD PANEL */}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab currentUser={user} />
        )}
        {/* 🧠 TAB 5: AI QUIZ PANEL */}
        {activeTab === 'quizzes' && (
          <QuizTab currentUser={user} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;