import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass =
    "block md:inline text-slate-300 hover:text-emerald-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-900 transition-all";

  return (
    <nav className="bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 font-black text-white text-lg tracking-tight">
            <span className="text-xl">🌍</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              CarbonTrack
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={linkClass}>Dashboard</Link>
            <Link to="/challenges" className={linkClass}>Challenges</Link>
            <Link to="/leaderboard" className={linkClass}>Leaderboard</Link>
            <Link to="/team-challenges" className={linkClass}>Team</Link>
            <Link to="/marketplace" className={linkClass}>Marketplace</Link>
            <Link to="/my-orders" className={linkClass}>Orders</Link>
            <Link to="/feed" className={linkClass}>Feed</Link>
            <Link to="/analytics" className={linkClass}>Analytics</Link>
            {user?.role === "user" && (
              <Link to="/apply-provider" className={linkClass}>Become Provider</Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/verification" className={linkClass}>Verifications</Link>
                <Link to="/admin" className={linkClass}>Admin</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="ml-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-slate-800">
            <Link to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/challenges" className={linkClass} onClick={() => setMenuOpen(false)}>Challenges</Link>
            <Link to="/leaderboard" className={linkClass} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/team-challenges" className={linkClass} onClick={() => setMenuOpen(false)}>Team</Link>
            <Link to="/marketplace" className={linkClass} onClick={() => setMenuOpen(false)}>Marketplace</Link>
            <Link to="/my-orders" className={linkClass} onClick={() => setMenuOpen(false)}>Orders</Link>
            <Link to="/feed" className={linkClass} onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/analytics" className={linkClass} onClick={() => setMenuOpen(false)}>Analytics</Link>
            {user?.role === "user" && (
              <Link to="/apply-provider" className={linkClass} onClick={() => setMenuOpen(false)}>Become Provider</Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/verification" className={linkClass} onClick={() => setMenuOpen(false)}>Verifications</Link>
                <Link to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Admin</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold mt-2"
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