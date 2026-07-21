import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get("/challenges/leaderboard");
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Studio Organic Hero */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              Global Rankings
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              Community Leaderboard 🏆
            </h1>
            <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Rankings based on total points earned by completing carbon reduction challenges and community quests.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            Loading leaderboard standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            No completed challenges yet. Be the first to earn points and claim rank #1!
          </div>
        ) : (
          <div className="eco-card overflow-hidden divide-y divide-emerald-950/10">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.userId}
                className="p-5 flex items-center justify-between hover:bg-emerald-950/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 flex items-center justify-center text-lg font-bold text-[#0F2D1E] shrink-0">
                    {medals[idx] || `#${idx + 1}`}
                  </div>

                  <div>
                    <p className="font-bold text-[#0F2D1E] text-base">{entry.name}</p>
                    {entry.organization && (
                      <p className="text-xs text-[#C96A2B] font-bold">🏢 {entry.organization}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-[#0F2D1E]">{entry.totalPoints} <span className="text-xs font-semibold text-[#557560]">pts</span></p>
                  <p className="text-xs text-[#557560]">{entry.challengesCompleted} challenge{entry.challengesCompleted !== 1 && "s"} completed</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;