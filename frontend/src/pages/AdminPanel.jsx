import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const roleBadges = {
  user: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  provider: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  admin: "bg-red-500/15 border-red-500/30 text-red-400",
};

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0D1829] via-[#0E1F36] to-[#0A1628] p-8 sm:p-12 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                System Administration
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
                Admin Panel 🛡️
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Manage user permissions, monitor system-wide activity, and review provider applications.
              </p>
            </div>

            <Link
              to="/admin/verification"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.02] transition shadow-lg shrink-0 text-center"
            >
              Provider Verifications →
            </Link>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">{stats.totalUsers}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Users</p>
            </div>
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-purple-400">{stats.totalProviders}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Providers</p>
            </div>
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-blue-400">{stats.totalActivities}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Activities</p>
            </div>
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-yellow-400">{stats.totalCO2Tracked}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">kg CO2 Tracked</p>
            </div>
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-teal-400">{stats.totalOrders}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Paid Orders</p>
            </div>
            <div className="obsidian-card p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">${stats.totalRevenue}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Revenue</p>
            </div>
          </div>
        )}

        <div className="obsidian-card p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">User Control</span>
            <h2 className="text-xl font-bold text-white tracking-tight">System User Directory</h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-2 text-xs font-black text-slate-950 hover:scale-[1.02] transition"
            >
              Filter
            </button>
          </form>

          {loading ? (
            <div className="text-center text-slate-400 py-6 text-xs">Loading user list...</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {users.map((u) => {
                const roleBadge = roleBadges[u.role] || roleBadges.user;

                return (
                  <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
                    <div>
                      <p className="font-bold text-white text-sm">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleBadge}`}>
                        {u.role}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${u.isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;