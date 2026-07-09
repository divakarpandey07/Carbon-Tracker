import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const postTypeLabels = {
  achievement: "🏆 Achievement",
  tip: "💡 Tip",
  milestone: "🎯 Milestone",
  general: "💬 General",
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Community Feed</h1>

        <form onSubmit={handlePost} className="bg-white rounded-lg shadow p-4 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your progress, tips, or achievements..."
            rows={3}
            maxLength={500}
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <div className="flex justify-between items-center">
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {Object.entries(postTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={posting || !newPost.trim()}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No posts yet. Be the first to share!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = post.likes.includes(user._id);
              const isOwner = post.user?._id === user._id;

              return (
                <div key={post._id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{post.user?.name}</p>
                      <p className="text-xs text-gray-400">
                        {postTypeLabels[post.postType]} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {(isOwner || user.role === "admin") && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{post.content}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
                    >
                      {isLiked ? "❤️" : "🤍"} {post.likes.length}
                    </button>
                    <span>💬 {post.comments.length}</span>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium text-gray-700">{c.user?.name}: </span>
                          <span className="text-gray-600">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)}
                      className="flex-1 border rounded px-3 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="text-green-600 text-sm font-medium"
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