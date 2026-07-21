import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const roleBadges = {
  user: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  provider: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  admin: "bg-red-500/15 border-red-500/30 text-red-400",
};

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const targetId = id || currentUser?._id;
  const isOwnProfile = currentUser?._id === targetId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/auth/users/${targetId}`);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (targetId) fetchProfile();
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen text-slate-100 font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center text-slate-400">Loading user profile...</div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen text-slate-100 font-sans">
        <Navbar />
        <div className="max-w-md mx-auto my-12 obsidian-card p-8 text-center space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-lg font-bold text-white">Profile Not Found</h2>
          <p className="text-xs text-slate-400">{error || "Could not retrieve profile information."}</p>
          <Link to="/leaderboard" className="inline-block px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
            ← Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const { user, totalPoints, challengesCompleted, totalCO2Tracked, totalLogs } = profileData;
  const roleBadgeStyle = roleBadges[user.role] || roleBadges.user;

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-10 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-[0_0_25px_rgba(16,185,129,0.4)] shrink-0">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-black text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{user.name}</h1>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${roleBadgeStyle}`}>
                  {user.role}
                </span>
                {isOwnProfile && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40">
                    Your Profile
                  </span>
                )}
              </div>

              {user.organization ? (
                <p className="text-xs font-bold text-emerald-400">🏢 Organization / Campus: {user.organization}</p>
              ) : (
                <p className="text-xs text-slate-400">Independent Sustainability Advocate</p>
              )}

              <p className="text-xs text-slate-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="obsidian-card p-5 text-center hover:border-emerald-500/40 transition">
            <span className="text-2xl mb-1 block">🏆</span>
            <p className="text-2xl font-black text-emerald-400">{totalPoints}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Total Eco Points</p>
          </div>

          <div className="obsidian-card p-5 text-center hover:border-teal-500/40 transition">
            <span className="text-2xl mb-1 block">🎯</span>
            <p className="text-2xl font-black text-teal-400">{challengesCompleted}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Quests Completed</p>
          </div>

          <div className="obsidian-card p-5 text-center hover:border-cyan-500/40 transition">
            <span className="text-2xl mb-1 block">📊</span>
            <p className="text-2xl font-black text-cyan-400">{totalCO2Tracked} <span className="text-xs font-normal text-slate-400">kg</span></p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">CO2 Tracked</p>
          </div>

          <div className="obsidian-card p-5 text-center hover:border-purple-500/40 transition">
            <span className="text-2xl mb-1 block">📝</span>
            <p className="text-2xl font-black text-purple-400">{totalLogs}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Activity Logs</p>
          </div>
        </div>

        {/* Public Badges Showcase */}
        <div className="obsidian-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <h3 className="text-lg font-black text-white tracking-tight">Unlocked Eco Badges</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-4 text-center">
              <span className="text-3xl mb-1 block">🌱</span>
              <p className="text-xs font-bold text-white">First Eco Log</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">Unlocked</p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-teal-500/30 p-4 text-center">
              <span className="text-3xl mb-1 block">🚗</span>
              <p className="text-xs font-bold text-white">Smart Commuter</p>
              <p className="text-[10px] text-teal-400 font-bold mt-1">Unlocked</p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-cyan-500/30 p-4 text-center">
              <span className="text-3xl mb-1 block">⚡</span>
              <p className="text-xs font-bold text-white">Power Saver</p>
              <p className="text-[10px] text-cyan-400 font-bold mt-1">Unlocked</p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-amber-500/30 p-4 text-center">
              <span className="text-3xl mb-1 block">🏆</span>
              <p className="text-xs font-bold text-white">Eco Contender</p>
              <p className="text-[10px] text-amber-400 font-bold mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* Shareable Eco-Rank Badge Card */}
        <div className="obsidian-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#0B1526] via-slate-950 to-[#0A1628] border-emerald-500/40">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Shareable Digital Badge</span>
              <h3 className="text-lg font-black text-white">Public Sustainability Rank Card</h3>
            </div>
            <span className="text-2xl">🌱</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-xs text-slate-300">
              <strong className="text-emerald-400">{user.name}</strong> has earned <strong className="text-emerald-400">{totalPoints} Eco Points</strong> and tracked <strong className="text-teal-400">{totalCO2Tracked} kg CO2</strong> on CarbonTrack.
            </p>
            {user.organization && (
              <p className="text-[11px] text-slate-500 font-semibold">Verified Member • {user.organization}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
