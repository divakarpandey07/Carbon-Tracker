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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Provider Applications</h1>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No pending applications right now.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div key={a._id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{a.organizationName}</h3>
                    <p className="text-xs text-gray-400">
                      Applicant: {a.user?.name} ({a.user?.email})
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    pending
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{a.description}</p>
                {a.website && (
                  <p className="text-xs text-blue-600 mb-3">{a.website}</p>
                )}
                {a.registrationNumber && (
                  <p className="text-xs text-gray-400 mb-3">Reg #: {a.registrationNumber}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(a.user._id)}
                    disabled={processingId === a.user._id}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                  >
                    Reject
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