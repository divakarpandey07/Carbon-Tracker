import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const categoryLabels = {
  transport: "🚗 Transport",
  food: "🍽️ Food & Diet",
  electricity: "⚡ Energy & Power",
  water: "💧 Water Saving",
  waste: "🗑️ Waste & Recycling",
  general: "🌍 Eco Lifestyle",
};

const categoryBadges = {
  transport: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  food: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  electricity: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  water: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  waste: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  general: "bg-purple-500/15 border-purple-500/30 text-purple-400",
};

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get("/challenges");
      setChallenges(data);
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (id) => {
    setJoiningId(id);
    try {
      await api.post(`/challenges/${id}/join`);
      setChallenges(
        challenges.map((c) => (c._id === id ? { ...c, isJoined: true } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join challenge");
    } finally {
      setJoiningId(null);
    }
  };

  const filteredChallenges =
    selectedCategory === "all"
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  const activeJoinedChallenges = challenges.filter((c) => c.isJoined);

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Minimalist Header */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              Eco Quests & Action Drives
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Sustainability Challenges 🎯
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Join local campus drives, Varanasi Ghats cleanups, and individual eco challenges to earn points and cut your footprint.
            </p>
          </div>
        </div>

        {/* My Active Joined Challenges Progress Section */}
        {activeJoinedChallenges.length > 0 && (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <h2 className="text-lg font-black text-white tracking-tight">My Active Quests ({activeJoinedChallenges.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJoinedChallenges.map((c) => (
                <div key={c._id} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm">{c.title}</h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold">+{c.points} pts</span>
                    <span className="text-slate-500">{c.durationDays} days challenge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              selectedCategory === "all"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-900/40 border border-white/10 text-slate-300 hover:bg-white/5"
            }`}
          >
            All Challenges ({challenges.length})
          </button>
          {Object.entries(categoryLabels).map(([catKey, catLabel]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                selectedCategory === catKey
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900/40 border border-white/10 text-slate-300 hover:bg-white/5"
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            Loading challenges...
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            No challenges available in this category right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((c) => {
              const badgeStyle = categoryBadges[c.category] || categoryBadges.general;

              return (
                <div
                  key={c._id}
                  className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 hover:scale-[1.02] transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {categoryLabels[c.category] || c.category}
                      </span>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                        +{c.points} pts
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-lg mb-2">{c.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">⏱️ {c.durationDays} Days</span>

                    {c.isJoined ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs cursor-default"
                      >
                        ✓ Already Joined
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(c._id)}
                        disabled={joiningId === c._id}
                        className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                      >
                        {joiningId === c._id ? "Joining..." : "Accept Challenge"}
                      </button>
                    )}
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

export default Challenges;