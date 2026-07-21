import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const roleBadges = {
  user: "bg-blue-100 border-blue-200 text-blue-800",
  provider: "bg-purple-100 border-purple-200 text-purple-800",
  admin: "bg-rose-100 border-rose-200 text-rose-800",
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
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
                Administration
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
                Admin Panel 🛡️
              </h1>
              <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
                Manage user permissions, monitor system-wide activity, and review provider applications.
              </p>
            </div>

            <Link
              to="/admin/verification"
              className="px-5 py-2.5 rounded-2xl bg-white text-[#0F2D1E] font-bold text-xs hover:bg-emerald-50 transition shadow-md shrink-0 text-center"
            >
              Provider Verifications →
            </Link>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#0F2D1E]">{stats.totalUsers}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Total Users</p>
            </div>
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#9333ea]">{stats.totalProviders}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Providers</p>
            </div>
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#2563eb]">{stats.totalActivities}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Activities</p>
            </div>
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#d97706]">{stats.totalCO2Tracked}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">kg CO2 Tracked</p>
            </div>
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#0891b2]">{stats.totalOrders}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Orders</p>
            </div>
            <div className="eco-card p-4 text-center">
              <p className="text-2xl font-black text-[#0F2D1E]">${stats.totalRevenue}</p>
              <p className="text-[10px] font-bold text-[#557560] uppercase tracking-widest mt-1">Revenue</p>
            </div>
          </div>
        )}

        <div className="eco-card p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E]">Directory</span>
            <h2 className="font-serif text-xl font-extrabold text-[#0F2D1E] tracking-tight">User Management</h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-2xl border border-emerald-950/15 bg-white px-4 py-2 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-emerald-950/15 bg-white px-4 py-2 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-[#0F2D1E] px-6 py-2 text-xs font-bold text-white hover:bg-[#163E2B] transition"
            >
              Filter
            </button>
          </form>

          {loading ? (
            <div className="text-center text-[#557560] py-6 text-xs">Loading user list...</div>
          ) : (
            <div className="divide-y divide-emerald-950/10">
              {users.map((u) => {
                const roleBadge = roleBadges[u.role] || roleBadges.user;

                return (
                  <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
                    <div>
                      <p className="font-bold text-[#0F2D1E] text-sm">{u.name}</p>
                      <p className="text-xs text-[#557560]">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleBadge}`}>
                        {u.role}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${u.isActive ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-slate-100 border-slate-300 text-slate-600"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        className="px-3 py-1 rounded-xl bg-white border border-emerald-950/15 text-xs font-bold text-[#0F2D1E] hover:bg-emerald-50 transition"
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