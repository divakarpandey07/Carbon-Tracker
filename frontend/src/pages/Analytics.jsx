import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#090E1A] border border-emerald-500/30 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value} kg CO2
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
    waste: "#10b981",
    other: "#ec4899",
  };

  if (loading) {
    return (
      <div className="min-h-screen text-slate-100 font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Advanced Telemetry
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
              Analytics & Net Impact 📊
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Deep dive into category-wise monthly breakdowns, platform comparisons, net carbon neutrality score, and logging streaks.
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="obsidian-card p-5 text-center">
            <p className="text-3xl font-black text-emerald-400">{overview?.totalFootprintCO2 ?? 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total kg CO2 Emitted</p>
          </div>
          <div className="obsidian-card p-5 text-center">
            <p className="text-3xl font-black text-teal-400">{overview?.totalOffsetsPurchased ?? 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Offsets Bought (kg)</p>
          </div>
          <div className="obsidian-card p-5 text-center">
            <p className="text-3xl font-black text-amber-400">{overview?.challengesCompleted ?? 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Quests Won</p>
          </div>
          <div className="obsidian-card p-5 text-center">
            <p className="text-3xl font-black text-purple-400">{streaks?.currentStreak ?? 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Day Streak 🔥</p>
          </div>
        </div>

        {/* Net Impact & Platform Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {netImpact && (
            <div className="obsidian-card p-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Balance Sheet</span>
                <h2 className="text-xl font-black text-white tracking-tight">Net Carbon Impact</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Gross CO2 Emitted</span>
                  <span className="font-bold text-red-400">{netImpact.totalEmitted} kg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Gross CO2 Offsetted</span>
                  <span className="font-bold text-emerald-400">{netImpact.totalOffset} kg</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-3 text-sm font-bold">
                  <span className="text-white">Net Carbon Score</span>
                  <span className={netImpact.netImpact <= 0 ? "text-emerald-400" : "text-amber-400"}>
                    {netImpact.netImpact} kg {netImpact.netImpact <= 0 ? "🌱 Carbon Neutral+" : "⚠️ Positive Emission"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {comparison && (
            <div className="obsidian-card p-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Benchmarking</span>
                <h2 className="text-xl font-black text-white tracking-tight">You vs Community</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Your Footprint</span>
                  <span className="font-bold text-white">{comparison.yourFootprint} kg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Community Average</span>
                  <span className="font-bold text-slate-400">{comparison.platformAverage} kg</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <p className={`text-xs font-bold ${comparison.comparedToPlatform === "below_average" ? "text-emerald-400" : "text-amber-400"}`}>
                    {comparison.comparedToPlatform === "below_average"
                      ? "🎉 Excellent! Your footprint is lower than the community average."
                      : comparison.comparedToPlatform === "above_average"
                      ? "⚡ You are slightly above community average. Explore challenges to reduce!"
                      : "Keep logging to unlock benchmarks."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Bar Chart */}
        <div className="obsidian-card p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Monthly Stacked Graph</span>
            <h2 className="text-xl font-black text-white tracking-tight">Emissions by Category</h2>
          </div>

          {categoryTrends.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-xs">Not enough monthly data recorded yet.</p>
          ) : (
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                  <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#cbd5e1" }} />
                  {Object.keys(categoryColors).map((cat) => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;