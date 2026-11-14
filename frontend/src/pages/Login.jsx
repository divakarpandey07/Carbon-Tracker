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

  const handleQuickFill = (roleType) => {
    if (roleType === "admin") {
      setLoginRole("admin");
      setForm({ email: "pandeydivakar07@gmail.com", password: "Bairagi@101" });
    } else {
      setLoginRole("user");
      setForm({ email: "pandeydivakar1080@gmail.com", password: "Bairagi@101" });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);

      // Verify role if logging in through Administrator tab
      if (loginRole === "admin" && data.role !== "admin") {
        setError("Access Denied: This account is not an Administrator. Please use User Login.");
        setLoading(false);
        return;
      }

      if (data.role === "admin" && loginRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pine via-pine2 to-mosslight px-4 py-8 sm:px-6 sm:py-10 text-mist">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-white/10 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* Left Hero & Info Column */}
          <div className="space-y-8 bg-pine2 px-8 py-10 lg:px-12 lg:py-14 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <span>🌍</span>
                <span>Bio-Tech Platform</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-semibold text-mist leading-tight">
                CarbonTrack Platform Login
              </h1>
              <p className="max-w-xl text-sage text-sm sm:text-base leading-relaxed">
                Log in to monitor carbon footprints, batch-import emission data files, join regional campus quests, or access administrator governance controls.
              </p>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="rounded-3xl bg-black/20 border border-white/10 p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-mosslight">⚡ Quick Switch Credentials</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill("user")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    loginRole === "user"
                      ? "border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/20"
                      : "border-white/10 bg-white/5 text-mist/80 hover:bg-white/10"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase text-emerald-300">👤 User Account</p>
                  <p className="text-xs font-semibold truncate mt-0.5">pandeydivakar1080@gmail.com</p>
                  <p className="text-[10px] text-sage mt-0.5">Pass: Bairagi@101</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("admin")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    loginRole === "admin"
                      ? "border-amber-400 bg-amber-500/20 text-white shadow-lg shadow-amber-500/20"
                      : "border-white/10 bg-white/5 text-mist/80 hover:bg-white/10"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase text-amber-300">🛡️ Administrator Account</p>
                  <p className="text-xs font-semibold truncate mt-0.5">pandeydivakar07@gmail.com</p>
                  <p className="text-[10px] text-sage mt-0.5">Pass: Bairagi@101</p>
                </button>
              </div>
            </div>

            <div className="grid gap-3 text-xs text-mist/80">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                <p className="font-semibold text-mist">📁 New: File Upload & Emission Analysis</p>
                <p className="mt-1 text-sage">Upload CSV activity sheets or utility bills for instant automated CO2 telemetry.</p>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="bg-mist px-6 py-8 sm:px-10 sm:py-12 flex flex-col justify-center">
            {/* Dual Login Tabs */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sage mb-3">Select Login Mode</p>
              <div className="flex rounded-2xl bg-pine/10 p-1.5 border border-sage/20">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    loginRole === "user"
                      ? "bg-pine text-mist shadow-md shadow-pine/20 scale-[1.02]"
                      : "text-pine/70 hover:text-pine"
                  }`}
                >
                  👤 User Login
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    loginRole === "admin"
                      ? "bg-pine text-mist shadow-md shadow-pine/20 scale-[1.02]"
                      : "text-pine/70 hover:text-pine"
                  }`}
                >
                  🛡️ Administrator Login
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pine tracking-tight">
                {loginRole === "admin" ? "Administrator Portal" : "User Dashboard Sign In"}
              </h2>
              <p className="mt-1 text-xs text-sage">
                {loginRole === "admin"
                  ? "Enter administrator credentials to access the governance console."
                  : "Enter your registered user email and password to continue."}
              </p>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-100/95 border border-red-300 px-4 py-3 text-xs font-medium text-red-800 mb-5 shadow-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pine/80 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={loginRole === "admin" ? "pandeydivakar07@gmail.com" : "pandeydivakar1080@gmail.com"}
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-sage/30 bg-white/95 px-4 py-3 text-sm text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pine/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-sage/30 bg-white/95 px-4 py-3 text-sm text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl py-3.5 text-sm font-black text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                  loginRole === "admin"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/30"
                    : "bg-gradient-to-r from-moss to-emerald-700 hover:from-mosslight hover:to-moss shadow-moss/30"
                }`}
              >
                {loading
                  ? "Authenticating..."
                  : loginRole === "admin"
                  ? "Sign In as Administrator 🛡️"
                  : "Sign In as User 🚀"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-pine/70">
              New here?{" "}
              <Link to="/register" className="font-bold text-moss hover:text-mosslight underline">
                Create user account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;