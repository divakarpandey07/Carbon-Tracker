import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";

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
    return <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">Loading trend...</div>;
  }

  if (trend.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Not enough data yet for a trend chart. Keep logging activities!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Emissions Trend (Last 6 Months)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: "kg CO2e", angle: -90, position: "insideLeft", fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} kg CO2e`, "Emissions"]} />
          <Line type="monotone" dataKey="totalCO2" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FootprintTrendChart;