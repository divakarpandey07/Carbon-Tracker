import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#090E1A] border border-emerald-500/30 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-emerald-400">
          🌱 {payload[0].value} <span className="text-xs font-medium text-slate-300">kg CO2e</span>
        </p>
      </div>
    );
  }
  return null;
};

const FootprintTrendChart = () => {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrend = async () => {
    try {
      const { data } = await api.get("/footprint/trend?months=6");
      setTrend(data);
    } catch (err) {
      console.error("Failed to fetch trend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend();
  }, []);

  if (loading) {
    return (
      <div className="obsidian-card p-8 text-center text-slate-400">
        Loading emissions trend...
      </div>
    );
  }

  if (trend.length === 0) {
    return (
      <div className="obsidian-card p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
        <span className="text-4xl mb-3">📈</span>
        <p className="font-bold text-white">No trend history available</p>
        <p className="text-xs text-slate-400 mt-1">Activities logged over time will populate this monthly emissions graph.</p>
      </div>
    );
  }

  return (
    <div className="obsidian-card p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Analytics Graph</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Emissions Trend</h2>
          </div>
          <span className="text-xs font-semibold bg-slate-950/80 border border-emerald-500/20 text-slate-300 px-3.5 py-1.5 rounded-full">
            Last 6 Months
          </span>
        </div>

        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bioTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
              <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalCO2"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#bioTrendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FootprintTrendChart;