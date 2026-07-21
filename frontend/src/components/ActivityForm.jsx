import { useState } from "react";
import api from "../utils/api";
import {
  CATEGORIES,
  SUBTYPES,
  UNITS,
  CAR_FUEL_TYPES,
  CAR_SIZES,
  CAR_AGES,
} from "../utils/constants";

const ActivityForm = ({ onActivityAdded }) => {
  const [form, setForm] = useState({
    category: "transport",
    subType: "car",
    quantity: "",
    unit: "km",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    metadata: {
      fuelType: "petrol",
      carSize: "medium",
      carAge: "mid",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const defaultSubType = SUBTYPES[category][0];
    setForm({
      ...form,
      category,
      subType: defaultSubType,
      metadata:
        category === "transport" && defaultSubType === "car"
          ? { fuelType: "petrol", carSize: "medium", carAge: "mid" }
          : {},
    });
  };

  const handleSubTypeChange = (e) => {
    const subType = e.target.value;
    setForm({
      ...form,
      subType,
      metadata:
        form.category === "transport" && subType === "car"
          ? { fuelType: "petrol", carSize: "medium", carAge: "mid" }
          : {},
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMetadataChange = (e) => {
    setForm({
      ...form,
      metadata: {
        ...form.metadata,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Please enter a valid positive quantity");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/activities", form);
      onActivityAdded(data);
      setForm({ ...form, quantity: "", notes: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const isCarTransport = form.category === "transport" && form.subType === "car";

  return (
    <div className="obsidian-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-xl text-emerald-400">
          ✏️
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Log Activity</h2>
          <p className="text-xs text-slate-400">Calculate carbon footprint instantly</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl mb-4 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Sub-Type</label>
            <select
              name="subType"
              value={form.subType}
              onChange={handleSubTypeChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              {SUBTYPES[form.category].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Smart Car Metadata Card */}
        {isCarTransport && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950/60 border border-emerald-500/30 p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">🚗</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">Vehicle Specs Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-emerald-200/80 mb-1">Fuel Type</label>
                <select
                  name="fuelType"
                  value={form.metadata?.fuelType || "petrol"}
                  onChange={handleMetadataChange}
                  className="w-full truncate rounded-xl border border-emerald-500/30 bg-slate-950 px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
                >
                  {CAR_FUEL_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-200/80 mb-1">Vehicle Size</label>
                <select
                  name="carSize"
                  value={form.metadata?.carSize || "medium"}
                  onChange={handleMetadataChange}
                  className="w-full truncate rounded-xl border border-emerald-500/30 bg-slate-950 px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
                >
                  {CAR_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-200/80 mb-1">Vehicle Age</label>
                <select
                  name="carAge"
                  value={form.metadata?.carAge || "mid"}
                  onChange={handleMetadataChange}
                  className="w-full truncate rounded-xl border border-emerald-500/30 bg-slate-950 px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
                >
                  {CAR_AGES.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Quantity</label>
            <input
              type="number"
              name="quantity"
              step="0.01"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              placeholder="e.g. 15"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
            placeholder="e.g. Highway drive to work"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Calculating & Saving..." : "Add Activity Log"}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;