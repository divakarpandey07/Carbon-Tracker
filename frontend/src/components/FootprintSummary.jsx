import { useState, useEffect } from "react";
import api from "../utils/api";

const categoryIcons = {
  transport: "🚗",
  food: "🍽️",
  electricity: "⚡",
  water: "💧",
  gas: "🔥",
  waste: "🗑️",
  other: "📦",
};

const categoryGradients = {
  transport: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
  food: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
  electricity: "from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30",
  water: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
  gas: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
  waste: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
  other: "from-slate-500/20 to-gray-500/10 text-slate-400 border-slate-500/30",
};

const FootprintSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTotal = async () => {
    try {
      const { data } = await api.get("/footprint/total");
      setData(data);
    } catch (err) {
      console.error("Failed to fetch footprint total:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
        Loading footprint totals...
      </div>
    );
  }

  if (!data || data.grandTotalCO2 === 0) {
    return (
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400 flex flex-col items-center justify-center">
        <span className="text-4xl mb-3">🌱</span>
        <p className="font-semibold text-slate-200">No footprint data recorded yet</p>
        <p className="text-xs text-slate-500 mt-1">Log your daily travel or energy usage to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Overview</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Total Carbon Footprint</h2>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Total Emitted</p>
              <p className="text-2xl font-black text-white">{data.grandTotalCO2} <span className="text-xs font-semibold text-emerald-400">kg CO2e</span></p>
            </div>
          </div>
        </div>

        {/* Category breakdown grid */}
        <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Breakdown by Category</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.breakdown.map((item) => {
            const percent = Math.round((item.totalCO2 / data.grandTotalCO2) * 100) || 0;
            const gradientStyle = categoryGradients[item._id] || categoryGradients.other;

            return (
              <div
                key={item._id}
                className={`rounded-2xl border bg-gradient-to-br ${gradientStyle} p-4 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{categoryIcons[item._id] || "📊"}</span>
                  <span className="text-xs font-bold opacity-80">{percent}%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 capitalize">{item._id}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{item.totalCO2} <span className="text-xs font-normal opacity-70">kg</span></p>
                  <p className="text-[11px] text-slate-400 mt-1">{item.count} log{item.count !== 1 && "s"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FootprintSummary;