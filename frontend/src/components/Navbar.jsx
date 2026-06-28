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

  const linkClass = "block md:inline text-gray-600 hover:text-green-700 text-sm font-medium px-3 py-2 rounded hover:bg-green-50";

  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/dashboard" className="font-bold text-green-700 text-lg">
            🌍 CarbonTrack
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
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-3 space-y-1">
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
              className="w-full text-left bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm mt-2"
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