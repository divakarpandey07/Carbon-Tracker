import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import FootprintSummary from "../components/FootprintSummary";
import FootprintTrendChart from "../components/FootprintTrendChart";
import EcoInsights from "../components/EcoInsights";

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get("/activities?limit=20");
      setActivities(data.activities);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityAdded = (newActivity) => {
    setActivities([newActivity, ...activities]);
    setRefreshKey((k) => k + 1);
  };

  const handleActivityDeleted = (id) => {
    setActivities(activities.filter((a) => a._id !== id));
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sleek Minimalist Glass Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 -mb-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Real-Time Carbon Telemetry
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{user?.name}</span> 👋
              </h1>
              <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                Log daily activities with smart vehicle factors, track category footprints, and view your emissions trajectory.
              </p>
            </div>

            {/* Floating Glass Stat Pills */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <div className="flex-1 min-w-[130px] rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800 p-4 text-center hover:border-emerald-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                <p className="mt-1 text-base font-extrabold text-emerald-400 capitalize">{user?.role || "User"}</p>
              </div>

              <div className="flex-1 min-w-[130px] rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800 p-4 text-center hover:border-emerald-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logs</p>
                <p className="mt-1 text-2xl font-black text-white">{activities.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footprint Summary & Trend Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-8">
            <FootprintSummary key={`summary-${refreshKey}`} />
          </div>
          <div className="lg:col-span-6 space-y-8">
            <FootprintTrendChart key={`trend-${refreshKey}`} />
          </div>
        </div>

        {/* Activity Form and Activity List + Live Eco Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 sticky top-20">
            <ActivityForm onActivityAdded={handleActivityAdded} />
          </div>

          <div className="lg:col-span-7 space-y-8">
            {loading ? (
              <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
                Loading activity history...
              </div>
            ) : (
              <>
                <ActivityList activities={activities} onActivityDeleted={handleActivityDeleted} />
                <EcoInsights activities={activities} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;