import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [progressInput, setProgressInput] = useState({});
  const [message, setMessage] = useState("");

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get("/challenges");
      setChallenges(data);
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    }
  };

  const fetchMyChallenges = async () => {
    try {
      const { data } = await api.get("/challenges/my-challenges");
      setMyChallenges(data);
    } catch (err) {
      console.error("Failed to fetch my challenges:", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchChallenges(), fetchMyChallenges()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleJoin = async (id) => {
    setJoiningId(id);
    setMessage("");
    try {
      await api.post(`/challenges/${id}/join`);
      setMessage("Joined challenge successfully! Track your progress in My Active Challenges below.");
      await loadAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to join");
    } finally {
      setJoiningId(null);
    }
  };

  const handleUpdateProgress = async (challengeId, currentProgress, targetValue) => {
    const valueStr = progressInput[challengeId];
    if (valueStr === undefined || valueStr === "") return;
    const addedVal = Number(valueStr);
    if (isNaN(addedVal) || addedVal < 0) return;

    const newProgress = Number(currentProgress || 0) + addedVal;
    setUpdatingId(challengeId);
    try {
      await api.put(`/challenges/${challengeId}/progress`, { progressValue: newProgress });
      setMessage("Progress updated successfully!");
      setProgressInput({ ...progressInput, [challengeId]: "" });
      await loadAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update progress");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-10 border border-emerald-500/20 shadow-2xl">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              Community & Regional Quests
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
              Carbon Reduction Challenges ⚡
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              Participate in localized eco-drives — from LPU campus green commutes to Varanasi Ghats zero-plastic initiatives. Earn impact points and boost your leaderboard standing!
            </p>
          </div>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-medium">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
            Loading challenges...
          </div>
        ) : (
          <>
            {/* My Active Challenges Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">My Active Challenges</h2>
                </div>
                <span className="text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full">
                  {myChallenges.length} Active
                </span>
              </div>

              {myChallenges.length === 0 ? (
                <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 text-center text-slate-400 text-xs">
                  You haven't joined any challenges yet. Explore available quests below!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myChallenges.map((item) => {
                    const c = item.challenge;
                    if (!c) return null;
                    const percent = Math.min(100, Math.round(((item.progressValue || 0) / c.targetValue) * 100));

                    return (
                      <div
                        key={item._id}
                        className={`rounded-3xl bg-slate-900/90 border ${
                          item.isCompleted ? "border-emerald-500/50 bg-emerald-950/20" : "border-slate-800"
                        } shadow-xl p-6 flex flex-col justify-between space-y-4`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="font-bold text-white text-base">{c.title}</h3>
                            {item.isCompleted ? (
                              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full shrink-0">
                                ✓ Completed (+{item.pointsEarned} pts)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full shrink-0">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-3">{c.description}</p>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                              <span>Challenge Progress</span>
                              <span className="text-emerald-400">
                                {item.progressValue || 0} / {c.targetValue} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                  item.isCompleted
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                    : "bg-gradient-to-r from-emerald-600 to-teal-500"
                                }`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {!item.isCompleted && (
                          <div className="pt-3 border-t border-slate-800 flex gap-2">
                            <input
                              type="number"
                              placeholder="Add progress value"
                              value={progressInput[c._id] || ""}
                              onChange={(e) =>
                                setProgressInput({ ...progressInput, [c._id]: e.target.value })
                              }
                              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleUpdateProgress(c._id, item.progressValue, c.targetValue)}
                              disabled={updatingId === c._id}
                              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-3.5 py-1.5 text-xs hover:from-emerald-400 hover:to-teal-400 transition disabled:opacity-50"
                            >
                              {updatingId === c._id ? "..." : "Log Progress"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* All Available Challenges Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Available Regional & Community Challenges</h2>
                </div>
                <span className="text-xs text-slate-400">{challenges.length} Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((c) => {
                  const isAlreadyJoined = c.isJoined || myChallenges.some((m) => m.challenge?._id === c._id);

                  return (
                    <div key={c._id} className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="font-bold text-white text-base">{c.title}</h3>
                          <span className="text-xs font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full shrink-0">
                            +{c.pointsReward} pts
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{c.description}</p>
                        <div className="text-[11px] text-slate-500 font-medium">
                          🗓️ {new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}
                          {" • "}Target: {c.targetValue}
                        </div>
                      </div>

                      {isAlreadyJoined ? (
                        <button
                          disabled
                          className="w-full rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold py-2.5 text-xs flex items-center justify-center gap-1 cursor-not-allowed opacity-90"
                        >
                          <span>✓</span> Already Joined
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(c._id)}
                          disabled={joiningId === c._id}
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-2.5 text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                        >
                          {joiningId === c._id ? "Joining..." : "Join Challenge"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;