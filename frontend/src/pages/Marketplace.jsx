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
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
                Verified Offsets
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
                Offset Marketplace 🛍️
              </h1>
              <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
                Purchase verified carbon offset credits from certified reforestation, solar power, and methane capture projects.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="eco-card p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search offset projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-emerald-950/15 bg-white px-4 py-2.5 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
          />
          <select
            value={offsetType}
            onChange={(e) => setOffsetType(e.target.value)}
            className="rounded-2xl border border-emerald-950/15 bg-white px-4 py-2.5 text-xs text-[#1A3022] outline-none focus:border-[#0F2D1E]"
          >
            <option value="">All Offset Categories</option>
            {Object.entries(offsetTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-[#0F2D1E] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#163E2B] transition"
          >
            Search Projects
          </button>
        </form>

        {loading ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            Loading offset projects...
          </div>
        ) : listings.length === 0 ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            No projects found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l._id} className="eco-card p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF2E9] border border-emerald-900/15 text-[#0F2D1E] px-2.5 py-1 rounded-full inline-block mb-3">
                    {offsetTypeLabels[l.offsetType] || l.offsetType}
                  </span>
                  <h3 className="font-serif font-bold text-[#0F2D1E] text-lg mb-2">{l.title}</h3>
                  <p className="text-xs text-[#557560] leading-relaxed mb-4">{l.description}</p>
                  <p className="text-[11px] text-[#557560] font-medium">
                    By <span className="text-[#0F2D1E] font-bold">{l.provider?.name}</span> {l.location && `• 📍 ${l.location}`}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-950/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#557560] font-bold">Price per kg</p>
                      <p className="text-xl font-black text-[#0F2D1E]">${l.pricePerUnit} <span className="text-xs font-normal text-[#557560]">/kg CO2</span></p>
                    </div>
                    <span className="text-xs font-bold bg-[#EAF2E9] text-[#0F2D1E] px-3 py-1 rounded-full border border-emerald-950/10">
                      {l.availableQuantity} kg left
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/marketplace/${l._id}`)}
                    className="w-full rounded-2xl bg-[#0F2D1E] text-white font-bold py-2.5 text-xs hover:bg-[#163E2B] transition shadow-md"
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