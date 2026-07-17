import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const TeamChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [leaderboards, setLeaderboards] = useState({});
  const [contributionInput, setContributionInput] = useState("");
  const [message, setMessage] = useState("");

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get("/team-challenges");
      setChallenges(data);
    } catch (err) {
      console.error("Failed to fetch team challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (id) => {
    setMessage("");
    try {
      await api.post(`/team-challenges/${id}/join`);
      setMessage("Joined! Your organization is now competing.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to join");
    }
  };

  const toggleLeaderboard = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!leaderboards[id]) {
      try {
        const { data } = await api.get(`/team-challenges/${id}/team-leaderboard`);
        setLeaderboards({ ...leaderboards, [id]: data });
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    }
  };

  const handleContribute = async (id) => {
    if (!contributionInput || Number(contributionInput) <= 0) return;
    try {
      await api.put(`/team-challenges/${id}/contribute`, { value: Number(contributionInput) });
      setMessage("Contribution logged!");
      setContributionInput("");
      const { data } = await api.get(`/team-challenges/${id}/team-leaderboard`);
      setLeaderboards({ ...leaderboards, [id]: data });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to contribute");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Corporate Team Challenges</h1>

        {!user?.organization && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
            Set an organization on your profile to join team challenges.
          </div>
        )}

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm">{message}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading team challenges...</div>
        ) : challenges.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No active team challenges right now.
          </div>
        ) : (
          <div className="space-y-4">
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
                  {" • "}Target: {c.targetValue}
                </div>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => handleJoin(c._id)}
                    disabled={!user?.organization}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                  >
                    Join with {user?.organization || "your org"}
                  </button>
                  <button
                    onClick={() => toggleLeaderboard(c._id)}
                    className="text-green-600 font-medium text-sm"
                  >
                    {expandedId === c._id ? "Hide" : "View"} Team Leaderboard
                  </button>
                </div>

                {expandedId === c._id && (
                  <div className="border-t pt-3">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="number"
                        placeholder="Add contribution (e.g. kg CO2 reduced)"
                        value={contributionInput}
                        onChange={(e) => setContributionInput(e.target.value)}
                        className="flex-1 border rounded px-3 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleContribute(c._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Contribute
                      </button>
                    </div>

                    {leaderboards[c._id]?.length > 0 ? (
                      <div className="space-y-1">
                        {leaderboards[c._id].map((team, idx) => (
                          <div key={team._id} className="flex justify-between text-sm py-1">
                            <span>{idx + 1}. {team._id}</span>
                            <span className="font-medium">
                              {team.totalContribution} pts ({team.memberCount} members)
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No contributions yet.</p>
                    )}
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