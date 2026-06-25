import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { io } from 'socket.io-client';
import { CheckCircle, Circle, Flame, Trophy, Sparkles, Loader2, Search, Edit2, Camera } from 'lucide-react';
import Navbar from './dashboard/Navbar';
import Sidebar from './dashboard/SideBar';
import HomeTab from './dashboard/HomeTab';
import RoadmapTab from './dashboard/RoadmapTab'; 
import CommunityTab from './dashboard/CommunityTab';
import LeaderboardTab from './dashboard/LeaderboardTab';
import QuizTab from './dashboard/QuizTab';
import axios from 'axios';
import BadgesTab from './dashboard/BadgesTab';
import { uploadImageToCloudinary } from '../utils/uploadImage';

const Dashboard = () => {
  // --- 1. STATE VARIABLES ---
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
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

      const socket = io(import.meta.env.VITE_API_URL);

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

  const fetchPosts = async (pageNumber = 1) => {
    setIsFetchingMore(true);
    try {
      // Pass the page number to our newly updated backend route
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts?page=${pageNumber}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (pageNumber === 1) {
        // If it's the first page, replace the array entirely (useful for initial load or refreshing)
        setPosts(res.data.posts);
      } else {
        // If it's page 2+, append the new posts to the BOTTOM of the existing array
        setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
      }
      
      setHasMorePosts(res.data.hasMore);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Run this once when the component mounts to get the first 10 posts
  useEffect(() => {
    fetchPosts(1);
  }, []);

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
      console.error("AI Generation Error:", error);
    
    // Check if the error is coming from an overloaded server
    if (error.response?.status === 503 || error.message.includes('503')) {
      alert("The AI servers are currently taking a quick coffee break due to high demand! Please wait 60 seconds and try again.");
    } else {
      alert("Something went wrong generating your roadmap. Please try again later.");
    }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // --- HANDLE PROFILE UPDATE ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      let newProfilePicUrl = user.profilePicture; // Default to existing picture

      // 1. If the user selected a new file, shoot it up to Cloudinary first
      if (editProfileData.file) {
        const uploadedUrl = await uploadImageToCloudinary(editProfileData.file);
        
        if (uploadedUrl) {
          newProfilePicUrl = uploadedUrl;
        } else {
          alert("Image upload failed. Check your Cloudinary keys!");
          return; // Stop the execution if the upload fails
        }
      }

      // 2. Send the new text URL to your MongoDB database
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        username: editProfileData.username,
        profilePicture: newProfilePicUrl
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // 3. Update the frontend UI with the new data from the database
      setUser(res.data);
      setIsEditingProfile(false); // Close the edit window

    } catch (error) {
      console.error("Error updating profile:", error);
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

  const handleCreatePost = async (postText, imageFile) => {
    if (!postText && !imageFile) return; // Prevent empty posts

    let mediaUrl = "";

    // 1. If the user attached an image, upload it to Cloudinary first
    if (imageFile) {
      mediaUrl = await uploadImageToCloudinary(imageFile);
      
      if (!mediaUrl) {
        alert("Image upload failed. Please try again.");
        return; // Stop the execution if the upload fails
      }
    }

    // 2. Send the text and the new Cloudinary URL to your MongoDB backend
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/community/post`, {
        text: postText,
        mediaUrl: mediaUrl // Storing just the URL string!
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // 3. Optimistically add the new post to the top of the feed
      setPosts([res.data, ...posts]);
      
      return true; // Return true so the frontend knows it succeeded and can clear the input
    } catch (error) {
      console.error("Error creating post", error);
      alert("Failed to create post.");
      return false;
    }
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

  // --- HANDLE TOGGLE LIKE ---
  const handleToggleLike = async (postId) => {
    try {
      // 1. Optimistically update the UI instantly
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes?.includes(user._id || user.id);
          let newLikes = [...(post.likes || [])];
          
          if (hasLiked) {
            newLikes = newLikes.filter(id => id !== (user._id || user.id));
          } else {
            newLikes.push(user._id || user.id);
          }
          return { ...post, likes: newLikes };
        }
        return post;
      }));

      // 2. Send request to the backend
      // IMPORTANT: Adjust this URL to match your exact backend setup!
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
    } catch (error) {
      console.error("Error toggling like:", error);
      // In a production app, if this fails, you'd revert the optimistic UI update here
    }
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
            handleToggleLike={handleToggleLike}
            fetchMorePosts={() => fetchPosts(page + 1)} // <-- ADD THIS
            hasMorePosts={hasMorePosts}                 // <-- ADD THIS
            isFetchingMore={isFetchingMore}
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
        {/* 🏅 TAB 6: MY BADGES PANEL */}
        {activeTab === 'badges' && (
          <BadgesTab currentUser={user} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;