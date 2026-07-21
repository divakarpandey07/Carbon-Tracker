import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === "/profile" && location.pathname.startsWith("/profile"));
    return `block md:inline text-xs font-bold px-3 py-2 rounded-full transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        : "text-slate-300 hover:text-emerald-400 hover:bg-white/5"
    }`;
  };

  return (
    <nav className="bg-[#0B111E]/80 border-b border-emerald-500/20 backdrop-blur-2xl sticky top-0 z-50 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 text-lg font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              🌍
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                CarbonTrack
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 -mt-1">
                Bio-Tech Platform
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
            <Link to="/challenges" className={getLinkClass("/challenges")}>Challenges</Link>
            <Link to="/leaderboard" className={getLinkClass("/leaderboard")}>Leaderboard</Link>
            <Link to="/team-challenges" className={getLinkClass("/team-challenges")}>Team</Link>
            <Link to="/marketplace" className={getLinkClass("/marketplace")}>Marketplace</Link>
            <Link to="/my-orders" className={getLinkClass("/my-orders")}>Orders</Link>
            <Link to="/feed" className={getLinkClass("/feed")}>Feed</Link>
            <Link to="/analytics" className={getLinkClass("/analytics")}>Analytics</Link>
            <Link to="/profile" className={getLinkClass("/profile")}>Profile</Link>
            {user?.role === "user" && (
              <Link to="/apply-provider" className={getLinkClass("/apply-provider")}>Become Provider</Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/verification" className={getLinkClass("/admin/verification")}>Verifications</Link>
                <Link to="/admin" className={getLinkClass("/admin")}>Admin</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-200 text-xl p-2 rounded-2xl border border-emerald-500/20 bg-slate-900/80"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1.5 border-t border-emerald-500/20">
            <Link to="/dashboard" className={getLinkClass("/dashboard")} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/challenges" className={getLinkClass("/challenges")} onClick={() => setMenuOpen(false)}>Challenges</Link>
            <Link to="/leaderboard" className={getLinkClass("/leaderboard")} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/team-challenges" className={getLinkClass("/team-challenges")} onClick={() => setMenuOpen(false)}>Team</Link>
            <Link to="/marketplace" className={getLinkClass("/marketplace")} onClick={() => setMenuOpen(false)}>Marketplace</Link>
            <Link to="/my-orders" className={getLinkClass("/my-orders")} onClick={() => setMenuOpen(false)}>Orders</Link>
            <Link to="/feed" className={getLinkClass("/feed")} onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/analytics" className={getLinkClass("/analytics")} onClick={() => setMenuOpen(false)}>Analytics</Link>
            <Link to="/profile" className={getLinkClass("/profile")} onClick={() => setMenuOpen(false)}>Profile</Link>
            {user?.role === "user" && (
              <Link to="/apply-provider" className={getLinkClass("/apply-provider")} onClick={() => setMenuOpen(false)}>Become Provider</Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/verification" className={getLinkClass("/admin/verification")} onClick={() => setMenuOpen(false)}>Verifications</Link>
                <Link to="/admin" className={getLinkClass("/admin")} onClick={() => setMenuOpen(false)}>Admin</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-xs font-bold mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;