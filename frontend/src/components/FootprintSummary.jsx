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
    return <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">Loading footprint...</div>;
  }

  if (!data || data.grandTotalCO2 === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No footprint data yet. Log some activities to see your impact!
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] bg-white/95 border border-sage/10 shadow-lg p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-pine">Your Carbon Footprint</h2>
          <p className="mt-1 text-sm text-sage">A summary of your total emissions and category breakdown.</p>
        </div>
        <div className="rounded-3xl bg-mosslight/20 border border-mosslight/30 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sage">Total Emissions</p>
          <p className="mt-2 text-3xl font-bold text-pine">{data.grandTotalCO2} kg CO2e</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {data.breakdown.map((item) => (
          <div key={item._id} className="rounded-3xl border border-sage/10 bg-mist/80 p-4 text-center">
            <div className="text-2xl mb-2">{categoryIcons[item._id] || "📊"}</div>
            <p className="text-xs text-sage capitalize">{item._id}</p>
            <p className="mt-2 text-lg font-semibold text-pine">{item.totalCO2} kg</p>
            <p className="text-xs text-sage/80">{item.count} logs</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootprintSummary;