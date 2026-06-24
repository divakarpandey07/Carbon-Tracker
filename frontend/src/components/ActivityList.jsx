import { useState } from "react";
import api from "../utils/api";

const ActivityList = ({ activities, onActivityDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity log?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/activities/${id}`);
      onActivityDeleted(id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="rounded-[1.75rem] bg-white/95 border border-sage/10 shadow-lg p-8 text-center text-pine">
        No activities logged yet. Add your first one above to start seeing your impact.
      </div>
    );
  }

  const categoryColors = {
    transport: "bg-blue-100 text-blue-700",
    food: "bg-orange-100 text-orange-700",
    electricity: "bg-yellow-100 text-yellow-700",
    water: "bg-cyan-100 text-cyan-700",
    gas: "bg-purple-100 text-purple-700",
    waste: "bg-gray-100 text-gray-700",
    other: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="rounded-[1.75rem] bg-white/95 border border-sage/10 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-pine">Recent Activities</h2>
        <p className="text-sm text-sage">{activities.length} entries</p>
      </div>
      <div className="divide-y divide-sage/10">
        {activities.map((a) => (
          <div key={a._id} className="flex flex-col gap-4 p-6 hover:bg-mist/70 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[a.category]}`}>
                {a.category}
              </span>
              <div>
                <p className="font-semibold text-pine">
                  {a.subType} — {a.quantity} {a.unit}
                </p>
                <p className="text-sm text-sage">
                  {new Date(a.date).toLocaleDateString()}
                  {a.notes && ` • ${a.notes}`}
                  {a.co2Emitted !== null && ` • ${a.co2Emitted} kg CO2e`}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(a._id)}
              disabled={deletingId === a._id}
              className="self-start rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed sm:self-center"
            >
              {deletingId === a._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;