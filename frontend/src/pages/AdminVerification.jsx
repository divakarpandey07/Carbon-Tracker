import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const AdminVerification = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/verification/pending");
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (userId) => {
    setProcessingId(userId);
    try {
      await api.put(`/verification/${userId}/approve`);
      setApplications(applications.filter((a) => a.user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    setProcessingId(userId);
    try {
      await api.put(`/verification/${userId}/reject`, { reason });
      setApplications(applications.filter((a) => a.user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Verification Queue
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
              Provider Applications 📝
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Review and verify corporate & offset provider registrations before granting marketplace publishing rights.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="obsidian-card p-8 text-center text-slate-400">
            No pending provider verification applications right now.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div key={a._id} className="obsidian-card p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{a.organizationName}</h3>
                    <p className="text-xs text-slate-400">
                      Applicant: <span className="text-slate-200 font-bold">{a.user?.name}</span> ({a.user?.email})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full">
                    Pending Review
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.description}</p>
                {a.website && (
                  <p className="text-xs text-teal-400 font-bold">{a.website}</p>
                )}
                {a.registrationNumber && (
                  <p className="text-[11px] text-slate-500">Reg #: {a.registrationNumber}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-black text-slate-950 hover:scale-[1.02] transition disabled:opacity-50"
                  >
                    Approve Provider
                  </button>
                  <button
                    onClick={() => handleReject(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;