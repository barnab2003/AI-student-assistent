import React from 'react';
import { Search } from 'lucide-react';

const CommunityTab = ({
  user,
  posts,
  searchQuery,
  setSearchQuery,
  handleCreatePost,
  newPostText,
  setNewPostText,
  setImageFile,
  editingPostId,
  setEditingPostId,
  editPostText,
  setEditPostText,
  submitEditPost,
  handleDeletePost,
  newCommentText,
  setNewCommentText,
  handleCreateComment
}) => {
  return (
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search posts or usernames..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
        />
      </div>

      {/* Render The Community Social Feed */}
      <div className="space-y-4">
        {posts.filter(post => 
          post.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.username.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((post) => (
          <div key={post._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            
            {/* Top Row: User Info & Actions */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm border border-blue-100 overflow-hidden shrink-0">
                  {post.userProfilePicture ? (
                    <img src={post.userProfilePicture} alt={post.username} className="w-full h-full object-cover" />
                  ) : (
                    `Lvl ${post.userLevel}`
                  )}
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
  );
};

export default CommunityTab;