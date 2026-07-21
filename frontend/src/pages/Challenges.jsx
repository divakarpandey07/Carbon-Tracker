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
      setMessage("Joined successfully! Track your progress in My Active Challenges below.");
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Carbon Reduction Challenges</h1>

        {message && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-4 rounded-xl mb-6 text-sm font-medium">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading challenges...</div>
        ) : (
          <>
            {/* My Active Challenges Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏆</span> My Active Challenges ({myChallenges.length})
              </h2>

              {myChallenges.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500 text-sm">
                  You haven't joined any challenges yet. Browse available challenges below to get started!
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
                        className={`bg-white rounded-2xl border ${
                          item.isCompleted ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200"
                        } shadow-sm p-5 flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{c.title}</h3>
                            {item.isCompleted ? (
                              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                                ✓ Completed (+{item.pointsEarned} pts)
                              </span>
                            ) : (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{c.description}</p>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                              <span>Progress</span>
                              <span>
                                {item.progressValue || 0} / {c.targetValue} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                  item.isCompleted ? "bg-emerald-500" : "bg-green-600"
                                }`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Log Progress Input if not completed */}
                        {!item.isCompleted && (
                          <div className="mt-2 pt-3 border-t border-gray-100 flex gap-2">
                            <input
                              type="number"
                              placeholder="Add progress value"
                              value={progressInput[c._id] || ""}
                              onChange={(e) =>
                                setProgressInput({ ...progressInput, [c._id]: e.target.value })
                              }
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              onClick={() => handleUpdateProgress(c._id, item.progressValue, c.targetValue)}
                              disabled={updatingId === c._id}
                              className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-800 transition disabled:opacity-50"
                            >
                              {updatingId === c._id ? "Saving..." : "Log Progress"}
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
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚡</span> Available Challenges
              </h2>

              {challenges.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
                  No active challenges right now. Check back later!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map((c) => {
                    const isAlreadyJoined = c.isJoined || myChallenges.some((m) => m.challenge?._id === c._id);

                    return (
                      <div key={c._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{c.title}</h3>
                            <span className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                              +{c.pointsReward} pts
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{c.description}</p>
                          <div className="text-xs text-gray-400 mb-4">
                            🗓️ {new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}
                            {" • "}Target: {c.targetValue}
                          </div>
                        </div>

                        {isAlreadyJoined ? (
                          <button
                            disabled
                            className="w-full bg-emerald-50 text-emerald-700 font-semibold py-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-center gap-1 cursor-not-allowed opacity-90"
                          >
                            <span>✓</span> Already Joined
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoin(c._id)}
                            disabled={joiningId === c._id}
                            className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-xl hover:bg-green-800 transition disabled:opacity-50 text-xs shadow-sm"
                          >
                            {joiningId === c._id ? "Joining..." : "Join Challenge"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;