import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const postTypeLabels = {
  achievement: "🏆 Achievement",
  tip: "💡 Eco Tip",
  milestone: "🎯 Milestone",
  general: "💬 Community Post",
};

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("general");
  const [posting, setPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/feed");
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post("/feed", { content: newPost, postType });
      setPosts([data, ...posts]);
      setNewPost("");
      setPostType("general");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/feed/${postId}/like`);
      setPosts(
        posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: data.message === "Post liked"
                  ? [...p.likes, user._id]
                  : p.likes.filter((id) => id !== user._id),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    try {
      const { data } = await api.post(`/feed/${postId}/comment`, { text });
      setPosts(posts.map((p) => (p._id === postId ? { ...p, comments: data.comments } : p)));
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to comment");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/feed/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              Social Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Eco Community Feed 💬
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Share your sustainability achievements, tips from campus & regional drives, and celebrate green milestones with fellow members.
            </p>
          </div>
        </div>

        {/* Create Post Form */}
        <form onSubmit={handlePost} className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your eco progress, tips, or Varanasi Ghats / LPU campus updates..."
            rows={3}
            maxLength={500}
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4 text-xs text-slate-100 outline-none focus:border-emerald-500"
          />
          <div className="flex justify-between items-center gap-3">
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              {Object.entries(postTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={posting || !newPost.trim()}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition disabled:opacity-50"
            >
              {posting ? "Posting..." : "Share Post"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            Loading community feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            No posts yet. Be the first to share an eco milestone!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const isLiked = post.likes.includes(user._id);
              const isOwner = post.user?._id === user._id;

              return (
                <div key={post._id} className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white text-base">{post.user?.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        <span className="text-emerald-400 font-semibold">{postTypeLabels[post.postType]}</span> • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {(isOwner || user.role === "admin") && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{post.content}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 font-bold transition ${isLiked ? "text-red-400" : "hover:text-red-400"}`}
                    >
                      {isLiked ? "❤️" : "🤍"} {post.likes.length} Likes
                    </button>
                    <span className="font-semibold">💬 {post.comments.length} Comments</span>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 border-t border-slate-800/80 pt-3">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="text-xs rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                          <span className="font-bold text-emerald-400">{c.user?.name}: </span>
                          <span className="text-slate-300">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)}
                      className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="px-4 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-emerald-400 font-bold text-xs hover:bg-slate-900 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;