import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import FootprintSummary from "../components/FootprintSummary";
import FootprintTrendChart from "../components/FootprintTrendChart";
import EcoInsights from "../components/EcoInsights";
import SavingsCalculator from "../components/SavingsCalculator";
import CertificateModal from "../components/CertificateModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCertModal, setShowCertModal] = useState(false);
  const [footprintData, setFootprintData] = useState(null);

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

  const fetchFootprint = async () => {
    try {
      const { data } = await api.get("/footprint/total");
      setFootprintData(data);
    } catch (err) {
      console.error("Failed to fetch footprint:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchFootprint();
  }, []);

  const handleActivityAdded = (newActivity) => {
    setActivities([newActivity, ...activities]);
    setRefreshKey((k) => k + 1);
    fetchFootprint(); // refresh footprint when new activity added
  };

  const handleActivityDeleted = (id) => {
    setActivities(activities.filter((a) => a._id !== id));
    setRefreshKey((k) => k + 1);
    fetchFootprint();
  };

  // Build real certificate data from actual dashboard state
  const buildCertData = () => {
    const totalCO2 = footprintData?.grandTotalCO2 || 0;
    const breakdown = footprintData?.breakdown || [];
    const topCategory = breakdown[0]?._id || "General Activities";
    const activityCount = activities.length;
    const txRef = `CT-${user?._id?.slice(-6)?.toUpperCase() || "000000"}-${new Date().getFullYear()}`;
    return {
      quantity: totalCO2,
      transactionRef: txRef,
      activityCount,
      topCategory,
      breakdown,
      listing: {
        title: `${activityCount} Tracked Activities — Top Category: ${topCategory}`,
      },
    };
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Luxury Obsidian Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Climate Telemetry Dashboard
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{user?.name}</span> 👋
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                Log daily activities with smart vehicle factors, track category footprints, and monitor your personal carbon trajectory in real-time.
              </p>
            </div>

            {/* Glowing Stat Pills & Certificate Trigger */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-3">
                <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-950/60 backdrop-blur-md border border-emerald-500/20 p-4 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                  <p className="mt-1 text-base font-extrabold text-emerald-400 capitalize">{user?.role || "User"}</p>
                </div>

                <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-950/60 backdrop-blur-md border border-emerald-500/20 p-4 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total CO₂</p>
                  <p className="mt-1 text-lg font-black text-emerald-400">
                    {footprintData ? `${footprintData.grandTotalCO2} kg` : `${activities.length} logs`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCertModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-105 transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <span>📜</span>
                <span>Generate Certificate</span>
              </button>
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
          <div className="lg:col-span-5 sticky top-20 space-y-8">
            <ActivityForm onActivityAdded={handleActivityAdded} />
            <SavingsCalculator />
          </div>

          <div className="lg:col-span-7 space-y-8">
            {loading ? (
              <div className="obsidian-card p-8 text-center text-slate-400">
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

      {/* Certificate Modal — driven by real footprint data */}
      {showCertModal && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          orderData={buildCertData()}
          user={user}
        />
      )}
    </div>
  );
};

export default Dashboard;