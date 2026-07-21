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
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              Verification Queue
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              Provider Applications 📝
            </h1>
            <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Review and verify corporate & offset provider registrations before granting marketplace publishing rights.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            No pending provider verification applications right now.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div key={a._id} className="eco-card p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-[#0F2D1E] text-lg">{a.organizationName}</h3>
                    <p className="text-xs text-[#557560]">
                      Applicant: <span className="text-[#0F2D1E] font-bold">{a.user?.name}</span> ({a.user?.email})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full">
                    Pending Review
                  </span>
                </div>
                <p className="text-xs text-[#1A3022] leading-relaxed">{a.description}</p>
                {a.website && (
                  <p className="text-xs text-[#0891b2] font-bold">{a.website}</p>
                )}
                {a.registrationNumber && (
                  <p className="text-[11px] text-[#557560]">Reg #: {a.registrationNumber}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="rounded-xl bg-[#0F2D1E] px-5 py-2 text-xs font-bold text-white hover:bg-[#163E2B] transition disabled:opacity-50"
                  >
                    Approve Provider
                  </button>
                  <button
                    onClick={() => handleReject(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="rounded-xl bg-rose-50 border border-rose-200 px-5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition disabled:opacity-50"
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