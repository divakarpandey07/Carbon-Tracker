import { useState } from "react";
import api from "../utils/api";
import { CATEGORIES, SUBTYPES, UNITS } from "../utils/constants";

const ActivityForm = ({ onActivityAdded }) => {
  const [form, setForm] = useState({
    category: "transport",
    subType: "car",
    quantity: "",
    unit: "km",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setForm({ ...form, category, subType: SUBTYPES[category][0] });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Please enter a valid quantity");
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

  return (
    <div className="bg-white/95 border border-sage/10 rounded-[1.75rem] shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-pine">Log New Activity</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-2xl mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-sage mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage mb-1">Sub-type</label>
          <select
            name="subType"
            value={form.subType}
            onChange={handleChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
          >
            {SUBTYPES[form.category].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            step="0.01"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
            placeholder="e.g. 15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage mb-1">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-sage mb-1">Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full rounded-3xl border border-sage/20 bg-mist/60 px-4 py-3 text-pine outline-none transition focus:border-moss focus:ring-2 focus:ring-mosslight/40"
            placeholder="Optional notes"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-moss px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-mosslight disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;