import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [netImpact, setNetImpact] = useState(null);
  const [streaks, setStreaks] = useState(null);
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ov, comp, net, str, trends] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/comparison"),
          api.get("/analytics/net-impact"),
          api.get("/analytics/streaks"),
          api.get("/analytics/category-trends"),
        ]);
        setOverview(ov.data);
        setComparison(comp.data);
        setNetImpact(net.data);
        setStreaks(str.data);

        const allCategories = new Set();
        trends.data.forEach((t) => t.categories.forEach((c) => allCategories.add(c.category)));

        const chartData = trends.data.map((t) => {
          const row = { period: t.period };
          allCategories.forEach((cat) => {
            const found = t.categories.find((c) => c.category === cat);
            row[cat] = found ? found.totalCO2 : 0;
          });
          return row;
        });
        setCategoryTrends(chartData);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const categoryColors = {
    transport: "#3b82f6",
    food: "#f97316",
    electricity: "#eab308",
    water: "#06b6d4",
    gas: "#a855f7",
    waste: "#6b7280",
    other: "#ec4899",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-center text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{overview?.totalFootprintCO2 ?? 0}</p>
            <p className="text-xs text-gray-500">Total kg CO2</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{overview?.totalOffsetsPurchased ?? 0}</p>
            <p className="text-xs text-gray-500">Offsets Bought (kg)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{overview?.challengesCompleted ?? 0}</p>
            <p className="text-xs text-gray-500">Challenges Won</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{streaks?.currentStreak ?? 0}</p>
            <p className="text-xs text-gray-500">Day Streak 🔥</p>
          </div>
        </div>

        {netImpact && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Net Carbon Impact</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Emitted</span>
              <span className="font-medium">{netImpact.totalEmitted} kg</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Offset</span>
              <span className="font-medium">{netImpact.totalOffset} kg</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Net Impact</span>
              <span className={`font-bold ${netImpact.netImpact <= 0 ? "text-green-600" : "text-red-500"}`}>
                {netImpact.netImpact} kg {netImpact.netImpact <= 0 ? "🌱 Carbon Neutral+" : "⚠️"}
              </span>
            </div>
          </div>
        )}

        {comparison && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">You vs Platform Average</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Your Footprint</span>
              <span className="font-medium">{comparison.yourFootprint} kg</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Platform Average</span>
              <span className="font-medium">{comparison.platformAverage} kg</span>
            </div>
            <p className={`text-sm font-medium mt-2 ${comparison.comparedToPlatform === "below_average" ? "text-green-600" : "text-orange-500"}`}>
              {comparison.comparedToPlatform === "below_average"
                ? "🎉 You're below average!"
                : comparison.comparedToPlatform === "above_average"
                ? "You're above average — room to improve"
                : "Not enough data yet"}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Emissions by Category (Monthly)</h2>
          {categoryTrends.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Not enough data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {Object.keys(categoryColors).map((cat) => (
                  <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;