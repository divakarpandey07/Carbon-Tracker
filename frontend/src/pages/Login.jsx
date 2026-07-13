import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pine via-pine2 to-mosslight px-6 py-10 text-mist">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/10 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-8 bg-pine2 px-8 py-12 lg:px-12 lg:py-16">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-mosslight">Carbon tracking</p>
              <h1 className="text-4xl font-display font-semibold text-mist sm:text-5xl">
                Welcome back to CarbonTrack
              </h1>
              <p className="max-w-xl text-sage leading-relaxed">
                Log in to continue tracking your emissions, joining challenges, and making more climate-smart choices.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-mist/80">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="font-semibold text-mist">Personal dashboard</p>
                <p className="mt-2 text-sage">View activity insights, footprint trends, and offset progress in one place.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="font-semibold text-mist">Ready for action</p>
                <p className="mt-2 text-sage">Keep your impact data up to date and join new climate challenges easily.</p>
              </div>
            </div>
          </div>
          <div className="bg-mist px-8 py-10 sm:px-10 sm:py-12">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-sage">Sign in</p>
              <h2 className="mt-4 text-3xl font-semibold text-pine">Access your dashboard</h2>
              <p className="mt-3 text-sm text-sage">Enter your details below to continue.</p>
            </div>
            {error && (
              <div className="rounded-2xl bg-red-100/90 px-4 py-3 text-sm text-red-700 mb-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-sage/20 bg-white/90 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/50"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-sage/20 bg-white/90 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-moss px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-mosslight disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-pine/70">
              New here?{' '}
              <Link to="/register" className="font-semibold text-moss hover:text-mosslight">
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;