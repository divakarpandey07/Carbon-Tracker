import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-[#0F2D1E] text-white p-3 shadow-xl border border-emerald-400/20">
        <p className="text-xs font-semibold text-emerald-200/80 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-emerald-300">
          🌱 {payload[0].value} <span className="text-xs font-normal text-emerald-100">kg CO2e</span>
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
      <div className="eco-card p-8 text-center text-[#557560]">
        Loading emissions trend...
      </div>
    );
  }

  if (trend.length === 0) {
    return (
      <div className="eco-card p-8 text-center text-[#557560] flex flex-col items-center justify-center h-full">
        <span className="text-4xl mb-3">📈</span>
        <p className="font-bold text-[#0F2D1E]">No trend history available</p>
        <p className="text-xs text-[#557560] mt-1">Activities logged over time will populate this monthly emissions graph.</p>
      </div>
    );
  }

  return (
    <div className="eco-card p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A2B]">Trajectory</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0F2D1E] tracking-tight">Emissions Trend</h2>
          </div>
          <span className="text-xs font-bold bg-[#E4EFE3] text-[#0F2D1E] px-3.5 py-1.5 rounded-full">
            Last 6 Months
          </span>
        </div>

        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="natureTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F2D1E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0F2D1E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE6DB" opacity={0.6} />
              <XAxis dataKey="period" tick={{ fill: "#557560", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#557560", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalCO2"
                stroke="#0F2D1E"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#natureTrendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FootprintTrendChart;