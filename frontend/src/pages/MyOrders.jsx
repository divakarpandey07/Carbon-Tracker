import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const statusBadges = {
  pending: "bg-amber-100 border-amber-300 text-amber-800",
  paid: "bg-emerald-100 border-emerald-300 text-emerald-800",
  cancelled: "bg-slate-100 border-slate-300 text-slate-700",
  failed: "bg-rose-100 border-rose-300 text-rose-800",
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
    <div className="min-h-screen text-[#1A3022] font-sans selection:bg-[#0F2D1E] selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0F2D1E] via-[#163E2B] to-[#204E36] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/15">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              Certificates & Purchases
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              My Offset Orders 📜
            </h1>
            <p className="mt-2 text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Track your carbon credit purchases, transaction references, and payment statuses.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="eco-card p-8 text-center text-[#557560]">
            No offset orders yet. Browse the Marketplace to buy your first offset credit!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const badgeStyle = statusBadges[o.status] || statusBadges.pending;

              return (
                <div
                  key={o._id}
                  className="eco-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-serif font-bold text-[#0F2D1E] text-base mb-1">{o.listing?.title || "Carbon Offset Project"}</h3>
                    <p className="text-xs text-[#557560]">
                      <span className="font-bold text-[#0F2D1E]">{o.quantity} kg CO2</span> • Total: ${o.totalAmount} • {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    {o.transactionRef && (
                      <p className="text-[11px] text-[#557560] mt-1 font-medium">Ref ID: {o.transactionRef}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${badgeStyle}`}>
                      {o.status}
                    </span>
                    {o.status === "pending" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-600 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;