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

  const handleExportCSV = () => {
    if (activities.length === 0) return;

    const headers = ["Category", "Subtype", "Quantity", "Unit", "CO2 Emitted (kg)", "Date", "Notes"];
    const rows = activities.map((a) => [
      `"${a.category}"`,
      `"${a.subType}"`,
      a.quantity,
      `"${a.unit}"`,
      a.co2Emitted || 0,
      `"${new Date(a.date).toLocaleDateString()}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbon_telemetry_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="obsidian-card p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[250px]">
        <span className="text-4xl mb-3">📝</span>
        <p className="font-bold text-white">No activity logs recorded yet</p>
        <p className="text-xs text-slate-400 mt-1">Add your daily travel or energy usage to start calculating.</p>
      </div>
    );
  }

  return (
    <div className="obsidian-card overflow-hidden">
      {/* Clean Header */}
      <div className="p-5 border-b border-emerald-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">History Telemetry</span>
          <h2 className="text-xl font-black text-white tracking-tight">Recent Activity Logs</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500"
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

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
          >
            <span>📥</span> CSV
          </button>
        </div>
      </div>

      {/* Smooth logs list */}
      <div className="divide-y divide-slate-800/60 max-h-[420px] overflow-y-auto pr-0.5">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No logs found under "{selectedFilter}" category.
          </div>
        ) : (
          displayedActivities.map((a) => {
            const badgeStyle = categoryBadges[a.category] || categoryBadges.other;
            const icon = categoryIcons[a.category] || "📦";

            return (
              <div
                key={a._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm capitalize">{a.subType}</span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
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
                      <div className="mt-1 flex flex-wrap gap-1.5">
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

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-slate-800/60 pt-2.5 sm:pt-0">
                  {a.co2Emitted !== null && (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">CO2 Impact</p>
                      <p className="text-sm font-black text-emerald-400">+{a.co2Emitted} kg</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={deletingId === a._id}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
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
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            {isExpanded ? "Show Less" : `View All (${filteredActivities.length}) Logs ↓`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityList;