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
  transport: "bg-blue-50/80 border-blue-200/60 text-blue-900",
  food: "bg-amber-50/80 border-amber-200/60 text-amber-900",
  electricity: "bg-yellow-50/80 border-yellow-200/60 text-yellow-900",
  water: "bg-cyan-50/80 border-cyan-200/60 text-cyan-900",
  gas: "bg-purple-50/80 border-purple-200/60 text-purple-900",
  waste: "bg-emerald-50/80 border-emerald-200/60 text-emerald-900",
  other: "bg-slate-50/80 border-slate-200/60 text-slate-900",
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
      <div className="eco-card p-8 text-center text-[#557560]">
        Loading footprint totals...
      </div>
    );
  }

  if (!data || data.grandTotalCO2 === 0) {
    return (
      <div className="eco-card p-8 text-center text-[#557560] flex flex-col items-center justify-center">
        <span className="text-4xl mb-3">🌱</span>
        <p className="font-bold text-[#0F2D1E]">No footprint data recorded yet</p>
        <p className="text-xs text-[#557560] mt-1">Log your daily travel or energy usage to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="eco-card p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A2B]">Analytics Overview</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0F2D1E] tracking-tight">Total Footprint</h2>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0F2D1E] text-white shadow-md">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">Total Emitted</p>
              <p className="text-2xl font-black">{data.grandTotalCO2} <span className="text-xs font-normal text-emerald-200">kg CO2e</span></p>
            </div>
          </div>
        </div>

        {/* Category breakdown grid */}
        <p className="text-[10px] font-bold text-[#557560] mb-3 uppercase tracking-widest">Category Breakdown</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.breakdown.map((item) => {
            const percent = Math.round((item.totalCO2 / data.grandTotalCO2) * 100) || 0;
            const cardStyle = categoryCardStyles[item._id] || categoryCardStyles.other;

            return (
              <div
                key={item._id}
                className={`rounded-2xl border ${cardStyle} p-4 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{categoryIcons[item._id] || "📊"}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 shadow-xs">
                    {percent}%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider capitalize">{item._id}</p>
                  <p className="text-xl font-black mt-0.5">{item.totalCO2} <span className="text-xs font-normal opacity-70">kg</span></p>
                  <p className="text-[11px] opacity-80 mt-1">{item.count} log{item.count !== 1 && "s"}</p>
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