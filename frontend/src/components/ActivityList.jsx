import { useState, useMemo } from "react";
import api from "../utils/api";

const categoryBadges = {
  transport: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  food: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  electricity: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  water: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  gas: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  waste: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  other: "bg-slate-500/15 border-slate-500/30 text-slate-400",
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

  if (activities.length === 0) {
    return (
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-4xl mb-3">📝</span>
        <p className="font-semibold text-slate-200">No activity logs recorded yet</p>
        <p className="text-xs text-slate-500 mt-1">Add your daily travel or energy usage to start calculating.</p>
      </div>
    );
  }

  const categories = ["all", "transport", "food", "electricity", "water", "gas", "waste", "other"];

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">History</span>
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity Logs</h2>
          </div>
          <span className="text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full">
            {filteredActivities.length} Logs
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedFilter === cat
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat === "all" ? "All Logs" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-800/80">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No logs found under "{selectedFilter}" category.
          </div>
        ) : (
          filteredActivities.map((a) => {
            const badgeStyle = categoryBadges[a.category] || categoryBadges.other;
            const icon = categoryIcons[a.category] || "📦";

            return (
              <div
                key={a._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm capitalize">{a.subType}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                        {a.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{a.quantity} {a.unit}</span>
                      {" • "}
                      {new Date(a.date).toLocaleDateString()}
                      {a.notes && <span className="italic"> • "{a.notes}"</span>}
                    </p>

                    {/* Metadata display if available */}
                    {a.metadata && Object.keys(a.metadata).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {a.metadata.fuelType && (
                          <span className="text-[10px] bg-slate-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                            Fuel: {a.metadata.fuelType}
                          </span>
                        )}
                        {a.metadata.carSize && (
                          <span className="text-[10px] bg-slate-950 text-teal-400 px-2 py-0.5 rounded-md border border-teal-500/20 font-medium">
                            Size: {a.metadata.carSize}
                          </span>
                        )}
                        {a.metadata.carAge && (
                          <span className="text-[10px] bg-slate-950 text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/20 font-medium">
                            Age: {a.metadata.carAge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0">
                  {a.co2Emitted !== null && (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">CO2 Impact</p>
                      <p className="text-sm font-extrabold text-emerald-400">+{a.co2Emitted} kg</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={deletingId === a._id}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition disabled:opacity-50"
                  >
                    {deletingId === a._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityList;