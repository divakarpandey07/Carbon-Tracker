import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/checkout/my-orders");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.post(`/checkout/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">My Orders</h1>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No orders yet. Browse the marketplace to buy your first offset!
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{o.listing?.title}</p>
                  <p className="text-xs text-gray-400">
                    {o.quantity} kg CO2 • ${o.totalAmount} • {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                  {o.transactionRef && (
                    <p className="text-xs text-gray-400">Ref: {o.transactionRef}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                  {o.status === "pending" && (
                    <button
                      onClick={() => handleCancel(o._id)}
                      className="text-red-500 text-sm font-medium hover:text-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;