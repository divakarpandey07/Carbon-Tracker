import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const statusBadges = {
  pending: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  paid: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  cancelled: "bg-slate-500/15 border-slate-500/30 text-slate-400",
  failed: "bg-red-500/15 border-red-500/30 text-red-400",
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-10 border border-emerald-500/20 shadow-2xl">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              Transactions & Certificates
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
              My Offset Orders 📜
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
              Track your carbon credit purchases, transaction references, and payment statuses.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center text-slate-400">
            No offset orders yet. Browse the Marketplace to buy your first offset credit!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const badgeStyle = statusBadges[o.status] || statusBadges.pending;

              return (
                <div
                  key={o._id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{o.listing?.title || "Carbon Offset Project"}</h3>
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400">{o.quantity} kg CO2</span> • Total: ${o.totalAmount} • {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    {o.transactionRef && (
                      <p className="text-[11px] text-slate-500 mt-1">Ref ID: {o.transactionRef}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeStyle}`}>
                      {o.status}
                    </span>
                    {o.status === "pending" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-500/20 transition"
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