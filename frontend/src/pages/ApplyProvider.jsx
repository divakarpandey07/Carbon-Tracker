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
      <div className="min-h-screen text-slate-100 font-sans">
        <Navbar />
        <div className="flex items-center justify-center p-8">
          <div className="obsidian-card p-8 text-center max-w-md w-full">
            <span className="text-4xl mb-3 block">ℹ️</span>
            <p className="text-slate-300 text-sm font-medium">
              {user?.role === "provider"
                ? "You are already a verified offset provider."
                : "This verification page is reserved for user accounts."}
            </p>
            <Link to="/dashboard" className="text-emerald-400 font-bold text-xs mt-4 inline-block hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="obsidian-card p-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              Provider Onboarding
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-3">Become an Offset Provider 🌿</h2>
            <p className="text-xs text-slate-400 mt-1">
              Apply to list certified carbon offset projects on our global marketplace.
            </p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs font-semibold">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                placeholder="e.g. Himalayan Reforestation Initiative"
                value={form.organizationName}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Registration Number (Optional)</label>
              <input
                type="text"
                name="registrationNumber"
                placeholder="e.g. REG-2026-8849"
                value={form.registrationNumber}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Website URL (Optional)</label>
              <input
                type="text"
                name="website"
                placeholder="https://example.org"
                value={form.website}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Project Description</label>
              <textarea
                name="description"
                placeholder="Describe your environmental projects, locations, and carbon offset methodology..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 p-4 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition disabled:opacity-50"
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