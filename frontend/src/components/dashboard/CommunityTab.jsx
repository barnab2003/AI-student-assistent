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
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* Create Post Interface Card (Brutalist Redesign) */}
      <form onSubmit={handleCreatePost} className="bg-white p-6 sm:p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-5">
        
        <textarea
          className="w-full p-4 border-2 border-black rounded-xl resize-none focus:ring-4 focus:ring-[#B9FF66] outline-none text-black font-medium transition-all"
          rows="3"
          placeholder="Share an insight, question, link, or progress picture..."
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Brutalist File Upload Input */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])} 
            className="w-full sm:w-auto text-sm font-bold text-gray-600 file:cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-2 file:border-black file:text-sm file:font-black file:bg-white file:text-black hover:file:bg-[#B9FF66] file:shadow-[2px_2px_0px_rgba(0,0,0,1)] file:transition-all"
          />
          <button type="submit" className="w-full sm:w-auto bg-black text-[#B9FF66] px-8 py-3 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_rgba(185,255,102,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(185,255,102,1)] transition-all">
            Post
          </button>
        </div>
      </form>

      {/* Search Bar (Brutalist Redesign) */}
      <div className="relative">
        <Search className="absolute left-5 top-5 text-black" size={24} />
        <input 
          type="text" 
          placeholder="Search ..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-5 pl-14 border-2 border-black rounded-[1.5rem] outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-black text-lg bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
        />
      </div>

      {/* Render The Community Social Feed */}
      <div className="space-y-8">
        {posts.filter(post => 
          post.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.username.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((post) => (
          <div key={post._id} className="bg-[#B9FF66] p-6 sm:p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6">
            
            {/* Top Row: User Info & Actions */}
            {/* Top Row: User Info & Actions (Responsive Redesign) */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              
              {/* Avatar & Username Group */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center font-black text-black text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0">
                  {post.userProfilePicture ? (
                    <img src={post.userProfilePicture} alt={post.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Lvl {post.userLevel}</span>
                  )}
                </div>
                {/* min-w-0 allows the text to truncate properly */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-black text-lg sm:text-xl tracking-tight truncate">@{post.username}</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Edit/Delete Dropdown logic */}
              {user && (user.id === post.userId || user._id === post.userId) && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditingPostId(post._id); setEditPostText(post.text); }} className="text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-black rounded-lg bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#B9FF66] hover:translate-y-[2px] hover:shadow-none transition-all">Edit</button>
                  <button onClick={() => handleDeletePost(post._id)} className="text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-black rounded-lg bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-red-400 hover:translate-y-[2px] hover:shadow-none transition-all">Delete</button>
                </div>
              )}
            </div>
            
            {/* Edit Mode vs Normal View */}
            {editingPostId === post._id ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border-2 border-black">
                <textarea 
                  className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] font-medium" 
                  value={editPostText} 
                  onChange={(e) => setEditPostText(e.target.value)} 
                  rows="3"
                />
                <div className="space-x-3">
                  <button onClick={() => submitEditPost(post._id)} className="text-sm font-black bg-[#B9FF66] text-black border-2 border-black px-5 py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all">Save Changes</button>
                  <button onClick={() => setEditingPostId(null)} className="text-sm font-black bg-white text-black border-2 border-black px-5 py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-black font-medium text-lg leading-relaxed whitespace-pre-wrap">{post.text}</p>
            )}

            {/* Render Image if it exists */}
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="Post attachment" className="rounded-2xl max-h-[32rem] w-full object-cover border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-2" />
            )}
            
            {/* Embedded Threaded Comments Section (Inverted Dark Theme) */}
            <div className=" bg-white p-5 sm:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-6 space-y-4">
              
              
              <div className="space-y-3">
                {post.comments && post.comments.length > 0 ? post.comments.map((comment, cIdx) => (
                  <div key={cIdx} className="text-sm border-l-4 border-[#B9FF66] pl-4 py-1 text-black">
                    <span className="font-black text-black">@{comment.username}: </span>
                    <span className="font-medium text-black">{comment.text}</span>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm font-medium italic">No comments </p>
                )}
              </div>
              
              {/* Inline Comment Form */}
              {/* Inline Comment Form - Responsive Stack */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-700">
                <input
                  type="text"
                  className="w-full p-3 border-2 border-black rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-[#B9FF66] bg-white text-black transition-all"
                  placeholder="Write a comment..."
                  value={newCommentText[post._id] || ''}
                  onChange={(e) => setNewCommentText({ ...newCommentText, [post._id]: e.target.value })}
                />
                <button onClick={() => handleCreateComment(post._id)} className="w-full sm:w-auto bg-black text-[#B9FF66] px-8 py-3 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_rgba(185,255,102,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(185,255,102,1)] transition-all">
                  Reply
                </button>
              </div>
            </div>

          </div>
        ))}
        
        {/* Empty State / No Posts Found */}
        {posts.length === 0 && (
           <div className="bg-white p-10 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] text-center">
             <h3 className="text-2xl font-black text-black mb-2">No posts yet</h3>
             <p className="text-gray-600 font-medium">Post Something</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default CommunityTab;