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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Leaderboard</h1>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No completed challenges yet. Be the first!
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-400 w-8">
                    {medals[idx] || `#${idx + 1}`}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{entry.name}</p>
                    {entry.organization && (
                      <p className="text-xs text-gray-400">{entry.organization}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{entry.totalPoints} pts</p>
                  <p className="text-xs text-gray-400">{entry.challengesCompleted} completed</p>
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