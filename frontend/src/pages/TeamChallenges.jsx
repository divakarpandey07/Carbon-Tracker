import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const TeamChallenges = () => {
  const { user, setUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [leaderboards, setLeaderboards] = useState({});
  const [contributionInput, setContributionInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [savingOrg, setSavingOrg] = useState(false);
  const [message, setMessage] = useState("");

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get("/team-challenges");
      setChallenges(data);
    } catch (err) {
      console.error("Failed to fetch team challenges:", err);
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSaveOrganization = async (e) => {
    e.preventDefault();
    if (!orgInput.trim()) return;
    setSavingOrg(true);
    setMessage("");
    try {
      const { data } = await api.put("/auth/profile", { organization: orgInput.trim() });
      const updatedUser = { ...user, organization: data.organization };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage(`Organization updated to "${data.organization}"! You can now join corporate team challenges.`);
      setOrgInput("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update organization");
    } finally {
      setSavingOrg(false);
    }
  };

  const handleJoin = async (id) => {
    setMessage("");
    try {
      await api.post(`/team-challenges/${id}/join`);
      setMessage("Joined! Your organization is now competing on the leaderboard.");
      toggleLeaderboard(id, true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to join team challenge");
    }
  };

  const toggleLeaderboard = async (id, forceFetch = false) => {
    if (expandedId === id && !forceFetch) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    try {
      const { data } = await api.get(`/team-challenges/${id}/team-leaderboard`);
      setLeaderboards((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error("Failed to fetch team leaderboard:", err);
    }
  };

  const handleContribute = async (id) => {
    if (!contributionInput || Number(contributionInput) <= 0) return;
    try {
      await api.put(`/team-challenges/${id}/contribute`, { value: Number(contributionInput) });
      setMessage("Contribution logged to your team!");
      setContributionInput("");
      const { data } = await api.get(`/team-challenges/${id}/team-leaderboard`);
      setLeaderboards((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to log contribution");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-8 border border-emerald-500/20 shadow-2xl">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Corporate Competitions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Team & Organization Challenges 🏢
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Rally your coworkers and organization members to compete collectively against other teams to reduce corporate carbon footprint.
            </p>

            {user?.organization && (
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span>🏢 Registered Org:</span>
                <span className="font-extrabold text-white">{user.organization}</span>
              </div>
            )}
          </div>
        </div>

        {/* Set Organization Banner if missing */}
        {!user?.organization && (
          <div className="rounded-3xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/40 p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="text-base font-bold text-amber-200">Organization Required</h3>
                <p className="text-xs text-slate-300">Set your company/college name to join corporate challenges.</p>
              </div>
            </div>

            <form onSubmit={handleSaveOrganization} className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="e.g. Acme Corp / IIIT Delhi"
                value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={savingOrg}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition disabled:opacity-50"
              >
                {savingOrg ? "Saving..." : "Set Org"}
              </button>
            </form>
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-medium">
            {message}
          </div>
        )}

        {/* Challenges List */}
        {loading ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
            Loading team challenges...
          </div>
        ) : challenges.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
            No active corporate team challenges right now.
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((c) => (
              <div key={c._id} className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                  </div>
                  <span className="text-xs font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full shrink-0">
                    +{c.pointsReward} pts
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>🗓️ {new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>🎯 Target: {c.targetValue}</span>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleJoin(c._id)}
                    disabled={!user?.organization}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join with {user?.organization || "Your Org"}
                  </button>

                  <button
                    onClick={() => toggleLeaderboard(c._id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
                  >
                    {expandedId === c._id ? "Hide Leaderboard" : "View Team Leaderboard 📊"}
                  </button>
                </div>

                {/* Team Leaderboard Expanded view */}
                {expandedId === c._id && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Log contribution value (e.g. 50 kg CO2)"
                        value={contributionInput}
                        onChange={(e) => setContributionInput(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleContribute(c._id)}
                        className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition"
                      >
                        Log Contribution
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Org Leaderboard Standings</h4>
                      {leaderboards[c._id]?.length > 0 ? (
                        <div className="space-y-2">
                          {leaderboards[c._id].map((team, idx) => (
                            <div
                              key={team._id}
                              className="rounded-2xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-emerald-400 text-sm">#{idx + 1}</span>
                                <div>
                                  <p className="font-bold text-white">{team._id}</p>
                                  <p className="text-[10px] text-slate-400">{team.memberCount} member{team.memberCount !== 1 && "s"} participating</p>
                                </div>
                              </div>
                              <span className="font-extrabold text-white text-sm">
                                {team.totalContribution} <span className="text-[10px] text-emerald-400 font-normal">pts</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-2xl border border-slate-800">
                          No team contributions recorded yet. Be the first to contribute!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChallenges;