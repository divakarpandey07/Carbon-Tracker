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
    return `block md:inline text-xs font-bold px-3.5 py-2 rounded-full transition-all duration-200 ${
      isActive
        ? "bg-[#0F2D1E] text-emerald-100 shadow-md shadow-emerald-950/10"
        : "text-[#2D4A36] hover:text-[#0F2D1E] hover:bg-emerald-950/5"
    }`;
  };

  return (
    <nav className="bg-white/75 border-b border-emerald-950/10 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#0F2D1E] flex items-center justify-center text-emerald-300 text-lg font-bold shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              🌿
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#0F2D1E]">
                CarbonTrack
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#C96A2B] -mt-1">
                Eco Intelligence
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
              className="ml-3 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#0F2D1E] text-xl p-2 rounded-2xl border border-emerald-950/10 bg-white/80"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1.5 border-t border-emerald-950/10">
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
              className="w-full text-left bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-full text-xs font-bold mt-2"
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