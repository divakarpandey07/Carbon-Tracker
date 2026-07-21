import { useState, useMemo } from "react";
import api from "../utils/api";

const categoryBadges = {
  transport: "bg-blue-100 text-blue-800 border-blue-200",
  food: "bg-amber-100 text-amber-800 border-amber-200",
  electricity: "bg-yellow-100 text-yellow-800 border-yellow-200",
  water: "bg-cyan-100 text-cyan-800 border-cyan-200",
  gas: "bg-purple-100 text-purple-800 border-purple-200",
  waste: "bg-emerald-100 text-emerald-800 border-emerald-200",
  other: "bg-slate-100 text-slate-800 border-slate-200",
};

const categoryIcons = {
  transport: "🚗",
  food: "🍽️",
  electricity: "⚡",
  water: "💧",
  gas: "🔥",
  waste: "🗑️",
  other: "📦",
};

const ActivityList = ({ activities, onActivityDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity log?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/activities/${id}`);
      onActivityDeleted(id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete activity");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredActivities = useMemo(() => {
    if (selectedFilter === "all") return activities;
    return activities.filter((a) => a.category === selectedFilter);
  }, [activities, selectedFilter]);

  const displayedActivities = useMemo(() => {
    if (isExpanded) return filteredActivities;
    return filteredActivities.slice(0, 5);
  }, [filteredActivities, isExpanded]);

  if (activities.length === 0) {
    return (
      <div className="eco-card p-8 text-center text-[#557560] flex flex-col items-center justify-center min-h-[250px]">
        <span className="text-4xl mb-3">📝</span>
        <p className="font-bold text-[#0F2D1E]">No activity logs recorded yet</p>
        <p className="text-xs text-[#557560] mt-1">Add your daily travel or energy usage to start calculating.</p>
      </div>
    );
  }

  return (
    <div className="eco-card overflow-hidden">
      {/* Clean Header */}
      <div className="p-5 sm:p-6 border-b border-emerald-950/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A2B]">History Logs</span>
          <h2 className="font-serif text-xl font-extrabold text-[#0F2D1E] tracking-tight">Recent Logs</h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-white border border-emerald-950/15 text-[#1A3022] text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-[#0F2D1E] shadow-xs"
          >
            <option value="all">All Categories ({activities.length})</option>
            <option value="transport">Transport 🚗</option>
            <option value="food">Food 🍽️</option>
            <option value="electricity">Electricity ⚡</option>
            <option value="water">Water 💧</option>
            <option value="gas">Gas 🔥</option>
            <option value="waste">Waste 🗑️</option>
            <option value="other">Other 📦</option>
          </select>
        </div>
      </div>

      {/* Smooth logs list */}
      <div className="divide-y divide-emerald-950/10 max-h-[420px] overflow-y-auto pr-0.5">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#557560]">
            No logs found under "{selectedFilter}" category.
          </div>
        ) : (
          displayedActivities.map((a) => {
            const badgeStyle = categoryBadges[a.category] || categoryBadges.other;
            const icon = categoryIcons[a.category] || "📦";

            return (
              <div
                key={a._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-emerald-950/5 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#0F2D1E] text-sm capitalize">{a.subType}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                        {a.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#557560]">
                      <span className="font-semibold text-[#1A3022]">{a.quantity} {a.unit}</span>
                      {" • "}
                      {new Date(a.date).toLocaleDateString()}
                      {a.notes && <span className="italic"> • "{a.notes}"</span>}
                    </p>

                    {/* Metadata display if available */}
                    {a.metadata && Object.keys(a.metadata).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {a.metadata.fuelType && (
                          <span className="text-[10px] bg-white text-[#0F2D1E] px-2 py-0.5 rounded-md border border-emerald-900/15 font-medium">
                            Fuel: {a.metadata.fuelType}
                          </span>
                        )}
                        {a.metadata.carSize && (
                          <span className="text-[10px] bg-white text-[#0F2D1E] px-2 py-0.5 rounded-md border border-emerald-900/15 font-medium">
                            Size: {a.metadata.carSize}
                          </span>
                        )}
                        {a.metadata.carAge && (
                          <span className="text-[10px] bg-white text-[#0F2D1E] px-2 py-0.5 rounded-md border border-emerald-900/15 font-medium">
                            Age: {a.metadata.carAge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-emerald-950/10 pt-2.5 sm:pt-0">
                  {a.co2Emitted !== null && (
                    <div className="text-right">
                      <p className="text-[10px] text-[#557560] uppercase tracking-widest font-bold">CO2 Impact</p>
                      <p className="text-sm font-black text-[#0F2D1E]">+{a.co2Emitted} kg</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={deletingId === a._id}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition disabled:opacity-50"
                  >
                    {deletingId === a._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View All Toggle Footer if > 5 activities */}
      {filteredActivities.length > 5 && (
        <div className="p-3 bg-[#EAF2E9] border-t border-emerald-950/10 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[#0F2D1E] hover:underline transition"
          >
            {isExpanded ? "Show Less" : `View All (${filteredActivities.length}) Logs ↓`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityList;