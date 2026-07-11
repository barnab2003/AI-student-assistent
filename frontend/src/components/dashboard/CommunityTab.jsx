import React, { useState, useRef, useCallback } from 'react';
import { MessageCircle, Heart, ImageIcon, X, Search, Loader2 } from 'lucide-react';

const CommunityTab = ({
  user,
  posts,
  searchQuery,
  setSearchQuery,
  handleCreatePost,
  editingPostId,
  setEditingPostId,
  editPostText,
  setEditPostText,
  submitEditPost,
  handleDeletePost,
  newCommentText,
  setNewCommentText,
  handleCreateComment,
  handleToggleLike,
  fetchMorePosts, 
  hasMorePosts,   
  isFetchingMore
}) => {
  // 1. Local state for the new Post + Image Upload feature
  const [newPostText, setNewPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // 2. Local submit handler to manage the loading spinner
  const submitPost = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    
    // Pass the local state up to the Dashboard's handleCreatePost function
    const success = await handleCreatePost(newPostText, postImage);
    
    if (success) {
      setNewPostText(""); // Clear text on success
      setPostImage(null); // Clear image on success
    }
    
    setIsPosting(false);
  };

  // 3. Infinite Scroll: Reference to our invisible "tripwire" div
  const observer = useRef();

  // 4. Infinite Scroll: Attaches the observer to the last element
  const lastPostElementRef = useCallback(node => {
    if (isFetchingMore) return; // Don't trigger if we are already fetching
    if (observer.current) observer.current.disconnect(); // Disconnect previous observer
    
    observer.current = new IntersectionObserver(entries => {
      // If the tripwire enters the screen AND we have more posts in the database
      if (entries[0].isIntersecting && hasMorePosts) {
        fetchMorePosts(); // FIRE THE FETCH!
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetchingMore, hasMorePosts, fetchMorePosts]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-mono text-[#bac2de]">
      
      {/* --- CREATE POST BAR --- */}
      <form onSubmit={submitPost} className="bg-[#111818] p-6 rounded-2xl border border-[#313244] shadow-lg mb-8">
        <textarea 
          placeholder="Share a resource, ask a question, or drop a meme..."
          className="w-full bg-[#1a2322] text-[#bac2de] p-4 rounded-xl border border-[#313244] resize-none h-24 outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] transition-all placeholder:text-[#bac2de]/40"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
        
        {/* Image Preview Area */}
        {postImage && (
          <div className="relative mt-4 inline-block">
            <img 
              src={URL.createObjectURL(postImage)} 
              alt="Preview" 
              className="max-h-48 rounded-xl border border-[#313244] object-cover"
            />
            <button 
              type="button" 
              onClick={() => setPostImage(null)}
              className="absolute -top-3 -right-3 bg-[#1a2322] text-[#f38ba8] p-1.5 rounded-full border border-[#313244] hover:bg-[#f38ba8] hover:text-[#111818] transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <label className="cursor-pointer bg-[#1a2322] text-[#bac2de] border border-[#313244] p-3 rounded-xl hover:text-[#89dceb] hover:border-[#89dceb] transition-colors">
            <ImageIcon size={20} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => setPostImage(e.target.files[0])}
            />
          </label>
          
          <button 
            type="submit" 
            disabled={isPosting || (!newPostText.trim() && !postImage)}
            className="bg-[#f38ba8] text-[#111818] font-bold px-8 py-2.5 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isPosting ? <Loader2 className="animate-spin" size={20} /> : <span>POST</span>}
          </button>
        </div>
      </form>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-5 top-4 text-[#89dceb]" size={20} />
        <input 
          type="text" 
          placeholder="Search ..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pl-12 border border-[#313244] rounded-2xl outline-none focus:border-[#89dceb] focus:ring-1 focus:ring-[#89dceb] text-[#bac2de] bg-[#111818] shadow-md transition-all placeholder:text-[#bac2de]/40"
        />
      </div>

      {/* Render The Community Social Feed */}
      <div className="space-y-6">
        {posts.filter(post => 
          post.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.username.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((post) => (
          <div key={post._id} className="bg-[#111818] p-6 sm:p-8 rounded-2xl border border-[#313244] shadow-lg space-y-6">
            
            {/* Top Row: User Info & Actions */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              
              {/* Avatar & Username Group */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1a2322] rounded-full flex items-center justify-center font-bold text-[#89dceb] text-sm border border-[#313244] overflow-hidden shrink-0">
                  {post.userProfilePicture ? (
                    <img src={post.userProfilePicture} alt={post.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Lvl {post.userLevel}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[#89dceb] text-lg sm:text-xl tracking-tight truncate">@{post.username}</h4>
                  <p className="text-[10px] sm:text-xs font-medium text-[#bac2de]/50 uppercase tracking-widest mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Edit/Delete Dropdown logic */}
              {user && (user.id === post.userId || user._id === post.userId) && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditingPostId(post._id); setEditPostText(post.text); }} className="text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 border border-[#313244] rounded-lg bg-[#1a2322] text-[#bac2de] hover:text-[#89dceb] hover:border-[#89dceb] transition-all">Edit</button>
                  <button onClick={() => handleDeletePost(post._id)} className="text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 border border-[#313244] rounded-lg bg-[#1a2322] text-[#bac2de] hover:text-[#f38ba8] hover:border-[#f38ba8] transition-all">Delete</button>
                </div>
              )}
            </div>
            
            {/* Edit Mode vs Normal View */}
            {editingPostId === post._id ? (
              <div className="space-y-3 bg-[#1a2322] p-4 rounded-xl border border-[#313244]">
                <textarea 
                  className="w-full p-4 border border-[#313244] bg-[#111818] text-[#bac2de] rounded-xl outline-none focus:border-[#89dceb] focus:ring-1 focus:ring-[#89dceb] transition-all" 
                  value={editPostText} 
                  onChange={(e) => setEditPostText(e.target.value)} 
                  rows="3"
                />
                <div className="space-x-3">
                  <button onClick={() => submitEditPost(post._id)} className="text-sm font-bold bg-[#89dceb] text-[#111818] px-5 py-2 rounded-lg hover:bg-opacity-90 transition-all">Save Changes</button>
                  <button onClick={() => setEditingPostId(null)} className="text-sm font-semibold bg-[#111818] text-[#bac2de] border border-[#313244] px-5 py-2 rounded-lg hover:bg-[#313244]/50 transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-[#bac2de] text-base leading-relaxed whitespace-pre-wrap">{post.text}</p>
            )}

            {/* Render Image if it exists */}
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="Post attachment" className="rounded-xl max-h-[32rem] w-full object-cover border border-[#313244] mt-4" />
            )}

            {/* --- INTERACTIVE ACTION BAR --- */}
            <div className="flex items-center space-x-4 mt-6">
              {/* Like Button */}
              <button 
                onClick={() => handleToggleLike(post._id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-[#313244] font-semibold text-sm transition-all ${
                  post.likes?.includes(user?.id || user?._id) 
                    ? 'bg-[#f38ba8]/10 text-[#f38ba8] border-[#f38ba8]/50' // Highlighted when liked
                    : 'bg-[#1a2322] text-[#bac2de] hover:border-[#f38ba8]/50 hover:text-[#f38ba8]'
                }`}
              >
                <Heart 
                  size={18} 
                  className={post.likes?.includes(user?.id || user?._id) ? "fill-current" : ""} 
                  strokeWidth={2} 
                />
                <span>{post.likes?.length || 0}</span>
              </button>
              
              {/* Comment Counter (Read-only UI flex) */}
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-[#313244] font-semibold text-sm bg-[#1a2322] text-[#bac2de]">
                <MessageCircle size={18} strokeWidth={2} className="text-[#89dceb]" />
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>

            {/* Embedded Threaded Comments Section */}
            <div className="bg-[#1a2322] p-5 sm:p-6 rounded-xl border border-[#313244] mt-6 space-y-4">
              
              <div className="space-y-3">
                {post.comments && post.comments.length > 0 ? post.comments.map((comment, cIdx) => (
                  <div key={cIdx} className="text-sm border-l-2 border-[#89dceb] pl-4 py-1 text-[#bac2de]">
                    <span className="font-bold text-[#89dceb]">@{comment.username}: </span>
                    <span className="opacity-90">{comment.text}</span>
                  </div>
                )) : (
                  <p className="text-[#bac2de]/50 text-xs font-medium italic">No comments yet. Start the conversation.</p>
                )}
              </div>
              
              {/* Inline Comment Form */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#313244]">
                <input
                  type="text"
                  className="w-full p-2.5 bg-[#111818] border border-[#313244] rounded-lg text-sm outline-none focus:border-[#89dceb] focus:ring-1 focus:ring-[#89dceb] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
                  placeholder="Write a comment..."
                  value={newCommentText[post._id] || ''}
                  onChange={(e) => setNewCommentText({ ...newCommentText, [post._id]: e.target.value })}
                />
                <button 
                  onClick={() => handleCreateComment(post._id)} 
                  className="w-full sm:w-auto bg-[#89dceb] text-[#111818] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all"
                >
                  Reply
                </button>
              </div>
            </div>

          </div>
        ))}

        {/* --- INFINITE SCROLL TRIPWIRE & LOADER --- */}
        {hasMorePosts && posts.length > 0 && (
          <div ref={lastPostElementRef} className="py-8 flex justify-center">
            {isFetchingMore ? (
              <div className="bg-[#111818] border border-[#313244] p-3 rounded-full shadow-lg">
                <Loader2 className="animate-spin text-[#f38ba8]" size={24} />
              </div>
            ) : (
              <div className="h-10"></div> /* Invisible spacer tripwire */
            )}
          </div>
        )}

        {!hasMorePosts && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-[#bac2de]/50 font-semibold uppercase tracking-widest text-xs border-t border-dashed border-[#313244] pt-6 inline-block">
              End of feed
            </p>
          </div>
        )}

        {/* Empty State / No Posts Found */}
        {posts.length === 0 && (
           <div className="bg-[#111818] p-10 rounded-2xl border border-[#313244] text-center shadow-lg">
             <h3 className="text-xl font-bold text-[#89dceb] mb-2">No transmissions found.</h3>
             <p className="text-[#bac2de]/60 text-sm">Be the first to post something.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default CommunityTab;