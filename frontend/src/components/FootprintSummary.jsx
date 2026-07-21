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

const categoryCardStyles = {
  transport: "from-blue-500/10 via-slate-900/40 to-slate-900/60 border-blue-500/30 text-blue-400",
  food: "from-amber-500/10 via-slate-900/40 to-slate-900/60 border-amber-500/30 text-amber-400",
  electricity: "from-yellow-500/10 via-slate-900/40 to-slate-900/60 border-yellow-500/30 text-yellow-400",
  water: "from-cyan-500/10 via-slate-900/40 to-slate-900/60 border-cyan-500/30 text-cyan-400",
  gas: "from-purple-500/10 via-slate-900/40 to-slate-900/60 border-purple-500/30 text-purple-400",
  waste: "from-emerald-500/10 via-slate-900/40 to-slate-900/60 border-emerald-500/30 text-emerald-400",
  other: "from-slate-500/10 via-slate-900/40 to-slate-900/60 border-slate-500/30 text-slate-400",
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
      <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
        Loading footprint totals...
      </div>
    );
  }

  if (!data || data.grandTotalCO2 === 0) {
    return (
      <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400 flex flex-col items-center justify-center">
        <span className="text-4xl mb-3">🌱</span>
        <p className="font-semibold text-slate-200">No footprint data recorded yet</p>
        <p className="text-xs text-slate-500 mt-1">Log your daily travel or energy usage to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Overview</span>
            <h2 className="text-2xl font-black text-white tracking-tight">Total Carbon Footprint</h2>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Total Emitted</p>
              <p className="text-2xl font-black text-white">{data.grandTotalCO2} <span className="text-xs font-semibold text-emerald-400">kg CO2e</span></p>
            </div>
          </div>
        </div>

        {/* Category breakdown grid */}
        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Breakdown by Category</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.breakdown.map((item) => {
            const percent = Math.round((item.totalCO2 / data.grandTotalCO2) * 100) || 0;
            const cardStyle = categoryCardStyles[item._id] || categoryCardStyles.other;

            return (
              <div
                key={item._id}
                className={`rounded-2xl border bg-gradient-to-br ${cardStyle} p-4 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{categoryIcons[item._id] || "📊"}</span>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-950/80 border border-current">
                    {percent}%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300 capitalize">{item._id}</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">{item.totalCO2} <span className="text-xs font-normal opacity-70">kg</span></p>
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