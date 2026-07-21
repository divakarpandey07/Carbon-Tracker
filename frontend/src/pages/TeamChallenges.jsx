import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const TeamChallenges = () => {
  const { user, setUser } = useAuth();
  const [orgChallenges, setOrgChallenges] = useState([]);
  const [orgLeaderboard, setOrgLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState(user?.organization || "");
  const [savingOrg, setSavingOrg] = useState(false);

  const fetchTeamData = async () => {
    try {
      const [chRes, lbRes] = await Promise.all([
        api.get("/challenges/team"),
        api.get("/challenges/team/leaderboard"),
      ]);
      setOrgChallenges(chRes.data);
      setOrgLeaderboard(lbRes.data);
    } catch (err) {
      console.error("Failed to fetch team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setSavingOrg(true);
    try {
      const { data } = await api.put("/auth/profile", { organization: orgName });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Organization saved successfully!");
      fetchTeamData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update organization");
    } finally {
      setSavingOrg(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Luxury Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                Corporate & Campus Drives
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
                Team Challenges 🏢
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Compete alongside colleagues, university peers, or company teams to rank on the organization leaderboard.
              </p>
            </div>

            {user?.organization && (
              <div className="rounded-2xl bg-slate-950/80 border border-emerald-500/30 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Joined Team</p>
                <p className="text-lg font-black text-white">{user.organization}</p>
              </div>
            )}
          </div>
        </div>

        {/* Inline Organization Setup Banner if missing */}
        {!user?.organization && (
          <div className="obsidian-card p-6 sm:p-8 space-y-4 border-l-4 border-l-amber-400">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-base font-bold text-white">Join an Organization or University Team</h3>
                <p className="text-xs text-slate-400">Enter your company, college (e.g. LPU, BHU), or team name to participate in team challenges.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateOrg} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. Lovely Professional University or EcoOffset Corp"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={savingOrg || !orgName.trim()}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {savingOrg ? "Saving..." : "Save Team"}
              </button>
            </form>
          </div>
        )}

        {/* Team Leaderboard & Team Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Organization Leaderboard */}
          <div className="lg:col-span-6 obsidian-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Standings</span>
              <h2 className="text-xl font-black text-white tracking-tight">Organization Leaderboard</h2>
            </div>

            {loading ? (
              <p className="text-slate-400 text-xs py-4 text-center">Loading team rankings...</p>
            ) : orgLeaderboard.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">No organization scores recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {orgLeaderboard.map((item, idx) => (
                  <div key={item._id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-white text-sm">{item._id}</p>
                        <p className="text-xs text-slate-500">{item.memberCount} members active</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-emerald-400">{item.totalPoints} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Quests List */}
          <div className="lg:col-span-6 obsidian-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Team Drives</span>
              <h2 className="text-xl font-black text-white tracking-tight">Active Quests</h2>
            </div>

            {loading ? (
              <p className="text-slate-400 text-xs py-4 text-center">Loading team quests...</p>
            ) : orgChallenges.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">No active team drives at the moment.</p>
            ) : (
              <div className="space-y-4">
                {orgChallenges.map((c) => (
                  <div key={c._id} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-base">{c.title}</h3>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                        +{c.points} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                    <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                      <span>⏱️ {c.durationDays} Days</span>
                      <span>Target: Team Drive</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChallenges;