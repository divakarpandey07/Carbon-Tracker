import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [message, setMessage] = useState("");

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
    setMessage("");
    try {
      await api.post(`/challenges/${id}/join`);
      setMessage("Joined successfully! Track your progress below.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to join");
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Challenges</h1>
        

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm">{message}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading challenges...</div>
        ) : challenges.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No active challenges right now. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{c.title}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    +{c.pointsReward} pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                <div className="text-xs text-gray-400 mb-3">
                  {new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleJoin(c._id)}
                  disabled={joiningId === c._id}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 text-sm"
                >
                  {joiningId === c._id ? "Joining..." : "Join Challenge"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;