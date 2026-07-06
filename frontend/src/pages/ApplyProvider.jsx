import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ApplyProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: "",
    registrationNumber: "",
    website: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/verification/apply", form);
      setSuccess("Application submitted! An admin will review it soon.");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "user") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">
              {user?.role === "provider"
                ? "You are already a provider."
                : "This page is only for regular users."}
            </p>
            <Link to="/dashboard" className="text-green-600 font-medium mt-3 inline-block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-green-700">Become an Offset Provider</h2>
          <p className="text-sm text-gray-500 mb-6">
            Apply to list and sell verified carbon offsets on our marketplace.
          </p>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="organizationName"
              placeholder="Organization Name"
              value={form.organizationName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number (optional)"
              value={form.registrationNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              name="website"
              placeholder="Website (optional)"
              value={form.website}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              name="description"
              placeholder="Describe your organization and offset projects"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyProvider;