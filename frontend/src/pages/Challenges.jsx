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
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Luxury Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Eco Quests & Action Drives
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
              Sustainability Challenges 🎯
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Join local campus drives, Varanasi Ghats cleanups, and individual eco challenges to earn points and cut your footprint.
            </p>
          </div>
        </div>

        {/* My Active Joined Challenges Progress Section */}
        {activeJoinedChallenges.length > 0 && (
          <div className="obsidian-card p-6 sm:p-8 space-y-4 border-l-4 border-l-emerald-400">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <h2 className="text-lg font-black text-white tracking-tight">My Active Quests ({activeJoinedChallenges.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJoinedChallenges.map((c) => (
                <div key={c._id} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm">{c.title}</h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-full">
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
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              selectedCategory === "all"
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            All Challenges ({challenges.length})
          </button>
          {Object.entries(categoryLabels).map(([catKey, catLabel]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCategory === catKey
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            Loading challenges...
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            No challenges available in this category right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((c) => (
              <div
                key={c._id}
                className="obsidian-card p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full">
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
                      className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs cursor-default"
                    >
                      ✓ Already Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(c._id)}
                      disabled={joiningId === c._id}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {joiningId === c._id ? "Joining..." : "Accept Challenge"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;