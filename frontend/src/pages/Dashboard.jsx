import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import FootprintSummary from "../components/FootprintSummary";
import FootprintTrendChart from "../components/FootprintTrendChart";


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
    <div className="min-h-screen bg-mist/80">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-[2rem] bg-white/95 border border-sage/10 shadow-2xl p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sage">Dashboard</p>
              <h1 className="mt-2 text-4xl font-display font-semibold text-pine">
                Welcome Back, {user?.name} 👋
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-sage">
                Here’s your activity summary, footprint trends, and the latest tools to keep reducing your carbon impact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-mosslight/15 border border-mosslight/30 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-sage">Role</p>
                <p className="mt-2 text-lg font-semibold text-pine">{user?.role || "User"}</p>
              </div>
              <div className="rounded-3xl bg-pine/5 border border-pine2/20 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-sage">Email</p>
                <p className="mt-2 text-sm font-medium text-pine break-all">{user?.email}</p>
              </div>
              <div className="rounded-3xl bg-mist border border-sage/10 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-sage">Activities</p>
                <p className="mt-2 text-lg font-semibold text-pine">{activities.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <FootprintSummary key={`summary-${refreshKey}`} />
          <FootprintTrendChart key={`trend-${refreshKey}`} />
          <ActivityForm onActivityAdded={handleActivityAdded} />

          {loading ? (
            <div className="rounded-[1.75rem] bg-white/95 border border-sage/10 p-8 text-center text-sage shadow-sm">
              Loading activities...
            </div>
          ) : (
            <ActivityList activities={activities} onActivityDeleted={handleActivityDeleted} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;