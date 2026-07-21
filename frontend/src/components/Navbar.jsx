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
    const isActive = location.pathname === path;
    return `block md:inline text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10"
        : "text-slate-300 hover:text-emerald-400 hover:bg-white/5"
    }`;
  };

  return (
    <nav className="bg-slate-950/70 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 font-black text-white text-lg tracking-tight group">
            <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              CarbonTrack
            </span>
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
              className="ml-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 text-xl p-2 rounded-xl border border-white/10 bg-slate-900/60"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1.5 border-t border-white/10">
            <Link to="/dashboard" className={getLinkClass("/dashboard")} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/challenges" className={getLinkClass("/challenges")} onClick={() => setMenuOpen(false)}>Challenges</Link>
            <Link to="/leaderboard" className={getLinkClass("/leaderboard")} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/team-challenges" className={getLinkClass("/team-challenges")} onClick={() => setMenuOpen(false)}>Team</Link>
            <Link to="/marketplace" className={getLinkClass("/marketplace")} onClick={() => setMenuOpen(false)}>Marketplace</Link>
            <Link to="/my-orders" className={getLinkClass("/my-orders")} onClick={() => setMenuOpen(false)}>Orders</Link>
            <Link to="/feed" className={getLinkClass("/feed")} onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/analytics" className={getLinkClass("/analytics")} onClick={() => setMenuOpen(false)}>Analytics</Link>
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
              className="w-full text-left bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold mt-2"
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