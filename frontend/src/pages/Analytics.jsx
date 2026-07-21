import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-[#0F2D1E] text-white p-3 shadow-xl border border-emerald-400/20">
        <p className="text-xs font-semibold text-emerald-200/80 mb-1">{label}</p>
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
    transport: "#2563eb",
    food: "#c96a2b",
    electricity: "#d97706",
    water: "#0891b2",
    gas: "#9333ea",
    waste: "#059669",
    other: "#db2777",
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[#1A3022] font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center text-[#557560]">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              Advanced Telemetry
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              Analytics & Net Impact 📊
            </h1>
            <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Deep dive into category-wise monthly breakdowns, platform comparisons, net carbon neutrality score, and logging streaks.
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="eco-card p-5 text-center">
            <p className="text-3xl font-black text-[#0F2D1E]">{overview?.totalFootprintCO2 ?? 0}</p>
            <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Total kg CO2 Emitted</p>
          </div>
          <div className="eco-card p-5 text-center">
            <p className="text-3xl font-black text-[#0891b2]">{overview?.totalOffsetsPurchased ?? 0}</p>
            <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Offsets Bought (kg)</p>
          </div>
          <div className="eco-card p-5 text-center">
            <p className="text-3xl font-black text-[#c96a2b]">{overview?.challengesCompleted ?? 0}</p>
            <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Quests Won</p>
          </div>
          <div className="eco-card p-5 text-center">
            <p className="text-3xl font-black text-[#9333ea]">{streaks?.currentStreak ?? 0}</p>
            <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Day Streak 🔥</p>
          </div>
        </div>

        {/* Net Impact & Platform Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {netImpact && (
            <div className="eco-card p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E]">Balance Sheet</span>
                <h2 className="font-serif text-xl font-extrabold text-[#0F2D1E] tracking-tight">Net Carbon Impact</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#557560]">
                  <span>Gross CO2 Emitted</span>
                  <span className="font-bold text-rose-700">{netImpact.totalEmitted} kg</span>
                </div>
                <div className="flex justify-between text-[#557560]">
                  <span>Gross CO2 Offsetted</span>
                  <span className="font-bold text-[#0F2D1E]">{netImpact.totalOffset} kg</span>
                </div>
                <div className="flex justify-between border-t border-emerald-950/10 pt-3 text-sm font-bold">
                  <span className="text-[#0F2D1E]">Net Carbon Score</span>
                  <span className={netImpact.netImpact <= 0 ? "text-[#0F2D1E]" : "text-[#c96a2b]"}>
                    {netImpact.netImpact} kg {netImpact.netImpact <= 0 ? "🌱 Carbon Neutral+" : "⚠️ Positive Emission"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {comparison && (
            <div className="eco-card p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0891b2]">Benchmarking</span>
                <h2 className="font-serif text-xl font-extrabold text-[#0F2D1E] tracking-tight">You vs Community</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#557560]">
                  <span>Your Footprint</span>
                  <span className="font-bold text-[#0F2D1E]">{comparison.yourFootprint} kg</span>
                </div>
                <div className="flex justify-between text-[#557560]">
                  <span>Community Average</span>
                  <span className="font-bold text-[#557560]">{comparison.platformAverage} kg</span>
                </div>
                <div className="pt-2 border-t border-emerald-950/10">
                  <p className={`text-xs font-bold ${comparison.comparedToPlatform === "below_average" ? "text-[#0F2D1E]" : "text-[#c96a2b]"}`}>
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
        <div className="eco-card p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E]">Monthly Breakdown</span>
            <h2 className="font-serif text-xl font-extrabold text-[#0F2D1E] tracking-tight">Emissions by Category</h2>
          </div>

          {categoryTrends.length === 0 ? (
            <p className="text-center text-[#557560] py-8 text-xs">Not enough monthly data recorded yet.</p>
          ) : (
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE6DB" opacity={0.6} />
                  <XAxis dataKey="period" tick={{ fill: "#557560", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#557560", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#1A3022" }} />
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