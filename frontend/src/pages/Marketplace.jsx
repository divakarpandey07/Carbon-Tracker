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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Carbon Offset Marketplace</h1>
          {user?.role === "provider" && (
            <span className="text-sm text-gray-500">You can manage listings via API/admin tools</span>
          )}
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search offsets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={offsetType}
            onChange={(e) => setOffsetType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Types</option>
            {Object.entries(offsetTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No listings found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l) => (
              <div key={l._id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded self-start mb-2">
                  {offsetTypeLabels[l.offsetType] || l.offsetType}
                </span>
                <h3 className="font-semibold text-gray-800 mb-1">{l.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-1">{l.description}</p>
                <p className="text-xs text-gray-400 mb-2">
                  By {l.provider?.name} {l.location && `• ${l.location}`}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <p className="font-bold text-green-700">
                    ${l.pricePerUnit} <span className="text-xs font-normal text-gray-500">/kg CO2</span>
                  </p>
                  <p className="text-xs text-gray-400">{l.availableQuantity} kg left</p>
                </div>
                <button
                  onClick={() => navigate(`/marketplace/${l._id}`)}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
                >
                  View & Buy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;