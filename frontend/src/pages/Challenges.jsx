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
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Minimalist Hero */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              Eco Quests & Action Drives
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              Sustainability Challenges 🎯
            </h1>
            <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Join local campus drives, Varanasi Ghats cleanups, and individual eco challenges to earn points and cut your footprint.
            </p>
          </div>
        </div>

        {/* My Active Joined Challenges Progress Section */}
        {activeJoinedChallenges.length > 0 && (
          <div className="eco-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#0F2D1E]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <h2 className="font-serif text-lg font-extrabold text-[#0F2D1E] tracking-tight">My Active Quests ({activeJoinedChallenges.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJoinedChallenges.map((c) => (
                <div key={c._id} className="rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#0F2D1E] text-sm">{c.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F2D1E] text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#557560] line-clamp-2">{c.description}</p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-[#0F2D1E] font-extrabold">+{c.points} pts</span>
                    <span className="text-[#557560]">{c.durationDays} days challenge</span>
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
                ? "bg-[#0F2D1E] text-emerald-100 shadow-md"
                : "bg-white border border-emerald-950/15 text-[#2D4A36] hover:bg-emerald-950/5"
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
                  ? "bg-[#0F2D1E] text-emerald-100 shadow-md"
                  : "bg-white border border-emerald-950/15 text-[#2D4A36] hover:bg-emerald-950/5"
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            Loading challenges...
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            No challenges available in this category right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((c) => (
              <div
                key={c._id}
                className="eco-card p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF2E9] border border-emerald-900/15 text-[#0F2D1E] px-2.5 py-1 rounded-full">
                      {categoryLabels[c.category] || c.category}
                    </span>
                    <span className="text-xs font-black text-[#C96A2B] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      +{c.points} pts
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-[#0F2D1E] text-lg mb-2">{c.title}</h3>
                  <p className="text-xs text-[#557560] leading-relaxed mb-4">{c.description}</p>
                </div>

                <div className="pt-4 border-t border-emerald-950/10 flex items-center justify-between">
                  <span className="text-xs text-[#557560] font-medium">⏱️ {c.durationDays} Days</span>

                  {c.isJoined ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-full bg-[#EAF2E9] border border-emerald-900/15 text-[#0F2D1E] font-bold text-xs cursor-default"
                    >
                      ✓ Already Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(c._id)}
                      disabled={joiningId === c._id}
                      className="px-5 py-2 rounded-full bg-[#0F2D1E] text-white font-bold text-xs hover:bg-[#163E2B] transition shadow-md disabled:opacity-50"
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