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
      setSuccess("Application submitted successfully! An admin will review your registration.");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "user") {
    return (
      <div className="min-h-screen text-[#1A3022] font-sans">
        <Navbar />
        <div className="flex items-center justify-center p-8">
          <div className="eco-card p-8 text-center max-w-md w-full">
            <span className="text-4xl mb-3 block">ℹ️</span>
            <p className="text-[#557560] text-sm font-medium">
              {user?.role === "provider"
                ? "You are already a verified offset provider."
                : "This verification page is reserved for user accounts."}
            </p>
            <Link to="/dashboard" className="text-[#0F2D1E] font-extrabold text-xs mt-4 inline-block hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="eco-card p-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E] bg-[#EAF2E9] border border-emerald-900/15 px-3.5 py-1.5 rounded-full">
              Provider Onboarding
            </span>
            <h2 className="font-serif text-2xl font-extrabold text-[#0F2D1E] tracking-tight mt-3">Become an Offset Provider 🌿</h2>
            <p className="text-xs text-[#557560] mt-1">
              Apply to list certified carbon offset projects on our global marketplace.
            </p>
          </div>

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-[#0F2D1E] p-3.5 rounded-2xl text-xs font-bold">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2D4A36] uppercase tracking-widest mb-1">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                placeholder="e.g. Himalayan Reforestation Initiative"
                value={form.organizationName}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-4 py-2.5 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D4A36] uppercase tracking-widest mb-1">Registration Number (Optional)</label>
              <input
                type="text"
                name="registrationNumber"
                placeholder="e.g. REG-2026-8849"
                value={form.registrationNumber}
                onChange={handleChange}
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-4 py-2.5 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D4A36] uppercase tracking-widest mb-1">Website URL (Optional)</label>
              <input
                type="text"
                name="website"
                placeholder="https://example.org"
                value={form.website}
                onChange={handleChange}
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-4 py-2.5 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D4A36] uppercase tracking-widest mb-1">Project Description</label>
              <textarea
                name="description"
                placeholder="Describe your environmental projects, locations, and carbon offset methodology..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-2xl border border-emerald-950/15 bg-white p-4 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F2D1E] py-3 text-xs font-bold text-white shadow-md hover:bg-[#163E2B] transition disabled:opacity-50"
            >
              {loading ? "Submitting Application..." : "Submit Verification Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyProvider;