import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/marketplace/${id}`);
        setListing(data);
      } catch (err) {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    setError("");
    setSuccess("");
    setPurchasing(true);
    try {
      const { data: order } = await api.post("/checkout/create-order", {
        listingId: id,
        quantity: Number(quantity),
      });

      await api.post(`/checkout/confirm/${order._id}`);

      setSuccess("Purchase successful! Redirecting to your orders...");
      setTimeout(() => navigate("/my-orders"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-center text-gray-500">Listing not found</div>
      </div>
    );
  }

  const total = (listing.pricePerUnit * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to="/marketplace" className="text-green-600 font-medium mb-4 inline-block">
          ← Back to Marketplace
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{listing.title}</h1>
          <p className="text-gray-600 mb-4">{listing.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-400">Provider</p>
              <p className="font-medium">{listing.provider?.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Location</p>
              <p className="font-medium">{listing.location || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400">Price per kg CO2</p>
              <p className="font-medium">${listing.pricePerUnit}</p>
            </div>
            <div>
              <p className="text-gray-400">Available</p>
              <p className="font-medium">{listing.availableQuantity} kg</p>
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Quantity (kg CO2 to offset)
            </label>
            <input
              type="number"
              min="1"
              max={listing.availableQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-bold text-green-700">${total}</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing || listing.availableQuantity === 0}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {purchasing ? "Processing..." : "Buy Offset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;