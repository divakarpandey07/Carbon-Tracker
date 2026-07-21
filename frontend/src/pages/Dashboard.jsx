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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Modern Dark Gradient Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-10 border border-emerald-500/20 shadow-2xl shadow-emerald-950/50">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Eco Dashboard Overview
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">{user?.name}</span> 👋
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                Track your emissions in real-time, log new daily activities with smart vehicle factors, and view your carbon reduction trajectory.
              </p>
            </div>

            {/* Quick User Stats */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <div className="flex-1 min-w-[130px] rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 text-center hover:bg-white/10 transition-all">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Role</p>
                <p className="mt-1 text-lg font-bold text-emerald-400 capitalize">{user?.role || "User"}</p>
              </div>

              <div className="flex-1 min-w-[130px] rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 text-center hover:bg-white/10 transition-all">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Logs</p>
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
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
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