import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loginRole, setLoginRole] = useState("user"); // 'user' | 'admin'
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);

      // Verify role if logging in through Administrator tab
      if (loginRole === "admin" && data.role !== "admin") {
        setError("Access Denied: This account is not authorized for the Administrator console. Please switch to User Login.");
        setLoading(false);
        return;
      }

      if (data.role === "admin" && loginRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07130E] via-[#0B1E16] to-[#040A07] px-4 py-8 sm:px-6 sm:py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl rounded-[2.5rem] bg-[#0E1A14]/80 border border-emerald-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_1fr]">
          {/* Classical Left Column */}
          <div className="relative bg-gradient-to-br from-[#0A1A12] via-[#08150E] to-[#040B07] p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-emerald-500/15 flex flex-col justify-between space-y-10">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 text-[11px] font-bold uppercase tracking-[0.25em]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ISO 14064 Climate Protocol
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-display">
                  CarbonTrack<span className="text-emerald-400">.</span>
                </h1>
                <p className="text-sm sm:text-base text-emerald-100/70 leading-relaxed font-normal max-w-lg">
                  Enterprise carbon telemetry, automated greenhouse gas accounting, and verified ecological asset management.
                </p>
              </div>

              {/* Classical Institutional Pillars */}
              <div className="pt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/10 hover:border-emerald-500/25 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏛️</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                      Institutional Governance
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300/80 leading-relaxed pl-8">
                    Verifiable footprint audits, ESG compliance tracking, and administrative governance consoles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/10 hover:border-emerald-500/25 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚖️</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                      Standardized Telemetry
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300/80 leading-relaxed pl-8">
                    Standardized emission factors conforming to international GHG protocols across transport, energy, and industry.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/10 hover:border-emerald-500/25 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌱</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                      Verified Ecological Registry
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300/80 leading-relaxed pl-8">
                    Direct retirement of accredited afforestation, solar grids, and verified environmental offset projects.
                  </p>
                </div>
              </div>
            </div>

            {/* Classical Quote */}
            <div className="relative z-10 pt-4 border-t border-emerald-500/10">
              <blockquote className="text-xs text-slate-400 italic leading-relaxed">
                “The greatest threat to our planet is the belief that someone else will save it.”
              </blockquote>
              <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90">
                — Robert Swan, Polar Explorer
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="bg-[#0B1510] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
            {/* Dual Login Tabs */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400/80 mb-3">
                Select Access Portal
              </p>
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/40 border border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    loginRole === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 scale-[1.01]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>👤</span>
                  <span>User Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    loginRole === "admin"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.01]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🛡️</span>
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            <div className="mb-6 space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {loginRole === "admin" ? "Administrator Sign In" : "User Portal Sign In"}
              </h2>
              <p className="text-xs text-slate-400">
                {loginRole === "admin"
                  ? "Enter authorized administrative credentials to access the governance console."
                  : "Enter your registered email and password to access your carbon dashboard."}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium leading-relaxed">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@organization.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 rounded-2xl py-3.5 text-xs font-black text-slate-950 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  loginRole === "admin"
                    ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:shadow-amber-500/30 hover:scale-[1.01]"
                    : "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:shadow-emerald-500/30 hover:scale-[1.01]"
                }`}
              >
                {loading
                  ? "Authenticating..."
                  : loginRole === "admin"
                  ? "Sign In to Administrator Console 🛡️"
                  : "Sign In to User Dashboard 🚀"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
              New here?{" "}
              <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 underline ml-1">
                Create user account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;