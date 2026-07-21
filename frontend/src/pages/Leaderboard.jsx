import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Luxury Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Global Standings
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
              Community Leaderboard 🏆
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Click any member's name to inspect their public sustainability profile, total points, and unlocked eco badges.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            Loading leaderboard standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            No completed challenges yet. Be the first to earn points and claim rank #1!
          </div>
        ) : (
          <div className="obsidian-card overflow-hidden divide-y divide-slate-800/80">
            {leaderboard.map((entry, idx) => {
              const isFirst = idx === 0;
              const isAdmin = entry.role === "admin" || entry.name.toLowerCase().includes("divakar");

              return (
                <div
                  key={entry.userId}
                  className={`p-5 flex items-center justify-between transition-colors ${
                    isFirst
                      ? "bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-slate-950 border-l-4 border-l-amber-400"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${
                      isFirst
                        ? "bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        : "bg-slate-950 border border-slate-800 text-slate-400"
                    }`}>
                      {medals[idx] || `#${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/profile/${entry.userId}`}
                          className={`font-black text-base hover:underline transition ${isFirst ? "text-amber-300" : "text-white"}`}
                        >
                          {entry.name}
                        </Link>
                        {isAdmin && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            👑 Super Admin
                          </span>
                        )}
                      </div>
                      {entry.organization && (
                        <p className="text-xs text-emerald-400 font-semibold mt-0.5">🏢 {entry.organization}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-black ${isFirst ? "text-amber-300" : "text-emerald-400"}`}>
                      {entry.totalPoints} <span className="text-xs font-semibold text-slate-400">pts</span>
                    </p>
                    <p className="text-xs text-slate-500">{entry.challengesCompleted} challenge{entry.challengesCompleted !== 1 && "s"} completed</p>
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

export default Leaderboard;