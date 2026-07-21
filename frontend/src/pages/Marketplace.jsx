import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const offsetTypeLabels = {
  tree_planting: "🌳 Tree Planting",
  renewable_energy: "☀️ Renewable Energy",
  methane_capture: "♻️ Methane Capture",
  ocean_conservation: "🌊 Ocean Conservation",
  soil_carbon: "🌱 Soil Carbon",
  other: "📦 Other",
};

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [offsetType, setOffsetType] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (offsetType) params.append("offsetType", offsetType);

      const { data } = await api.get(`/marketplace?${params.toString()}`);
      setListings(data.listings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Minimalist Glass Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
                Verified Carbon Offsets
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
                Carbon Offset Marketplace 🛍️
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Purchase verified carbon offset credits from certified reforestation, solar power, and methane capture projects.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 shadow-2xl flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search offset projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
          />
          <select
            value={offsetType}
            onChange={(e) => setOffsetType(e.target.value)}
            className="rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="">All Offset Categories</option>
            {Object.entries(offsetTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            Search Projects
          </button>
        </form>

        {loading ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            Loading offset projects...
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-center text-slate-400">
            No projects found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l._id} className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 hover:scale-[1.02] transition-all">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full inline-block mb-3">
                    {offsetTypeLabels[l.offsetType] || l.offsetType}
                  </span>
                  <h3 className="font-bold text-white text-lg mb-2">{l.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{l.description}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    By <span className="text-slate-300">{l.provider?.name}</span> {l.location && `• 📍 ${l.location}`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Price per kg</p>
                      <p className="text-xl font-black text-emerald-400">${l.pricePerUnit} <span className="text-xs font-normal text-slate-400">/kg CO2</span></p>
                    </div>
                    <span className="text-xs font-semibold bg-slate-950/80 text-slate-300 px-3 py-1 rounded-full border border-slate-800">
                      {l.availableQuantity} kg left
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/marketplace/${l._id}`)}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-2.5 text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/10"
                  >
                    View & Purchase Offset
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;