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
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Minimalist Glass Header */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              Global Rankings
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Community Leaderboard 🏆
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Rankings based on total points earned by completing carbon reduction challenges and community quests.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            Loading leaderboard standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            No completed challenges yet. Be the first to earn points and claim rank #1!
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden divide-y divide-slate-800/80">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.userId}
                className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-lg font-bold text-slate-400 shrink-0">
                    {medals[idx] || `#${idx + 1}`}
                  </div>

                  <div>
                    <p className="font-bold text-white text-base">{entry.name}</p>
                    {entry.organization && (
                      <p className="text-xs text-emerald-400 font-medium">🏢 {entry.organization}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-extrabold text-emerald-400">{entry.totalPoints} <span className="text-xs font-semibold text-slate-400">pts</span></p>
                  <p className="text-xs text-slate-500">{entry.challengesCompleted} challenge{entry.challengesCompleted !== 1 && "s"} completed</p>
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