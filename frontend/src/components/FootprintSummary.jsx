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
  transport: "from-blue-500/15 via-slate-900/60 to-slate-950/80 border-blue-500/40 text-blue-400",
  food: "from-amber-500/15 via-slate-900/60 to-slate-950/80 border-amber-500/40 text-amber-400",
  electricity: "from-yellow-500/15 via-slate-900/60 to-slate-950/80 border-yellow-500/40 text-yellow-400",
  water: "from-cyan-500/15 via-slate-900/60 to-slate-950/80 border-cyan-500/40 text-cyan-400",
  gas: "from-purple-500/15 via-slate-900/60 to-slate-950/80 border-purple-500/40 text-purple-400",
  waste: "from-emerald-500/15 via-slate-900/60 to-slate-950/80 border-emerald-500/40 text-emerald-400",
  other: "from-slate-500/15 via-slate-900/60 to-slate-950/80 border-slate-500/40 text-slate-400",
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
      <div className="obsidian-card p-8 text-center text-slate-400">
        Loading footprint totals...
      </div>
    );
  }

  if (!data || data.grandTotalCO2 === 0) {
    return (
      <div className="obsidian-card p-8 text-center text-slate-400 flex flex-col items-center justify-center">
        <span className="text-4xl mb-3">🌱</span>
        <p className="font-bold text-white">No footprint data recorded yet</p>
        <p className="text-xs text-slate-400 mt-1">Log your daily travel or energy usage to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="obsidian-card p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Telemetry Summary</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Total Footprint</h2>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Total Emitted</p>
              <p className="text-2xl font-black text-white">{data.grandTotalCO2} <span className="text-xs font-normal text-slate-400">kg CO2e</span></p>
            </div>
          </div>
        </div>

        {/* Category breakdown grid */}
        <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Category Breakdown</p>
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
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-200 capitalize">{item._id}</p>
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