import { useState } from "react";

const SavingsCalculator = () => {
  const [weeklyKm, setWeeklyKm] = useState(100);
  const [currentFuel, setCurrentFuel] = useState("petrol");
  const [alternateMode, setAlternateMode] = useState("metro");

  // Factors per km
  const fuelFactors = {
    petrol: 0.21,
    diesel: 0.24,
    cng: 0.16,
  };

  const alternateFactors = {
    metro: 0.04,
    bus: 0.07,
    cycling: 0.0,
    electric: 0.03,
  };

  const currentCO2Weekly = weeklyKm * (fuelFactors[currentFuel] || 0.21);
  const alternateCO2Weekly = weeklyKm * (alternateFactors[alternateMode] || 0.04);
  const weeklyCO2Saved = Math.max(0, currentCO2Weekly - alternateCO2Weekly);
  const annualCO2Saved = Math.round(weeklyCO2Saved * 52);
  const annualMoneySaved = Math.round(weeklyKm * 52 * 0.12 * 90); // Estimated fuel cost saved
  const equivalentTrees = Math.round(annualCO2Saved / 20);

  return (
    <div className="obsidian-card p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Interactive Simulation</span>
        <h3 className="text-xl font-black text-white tracking-tight mt-1">Smart Emission Savings Simulator ⚡</h3>
        <p className="text-xs text-slate-400 mt-1">Simulate switching your weekly commute mode to see annual carbon and cost savings.</p>
      </div>

      <div className="space-y-4">
        {/* Distance Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-300">Weekly Commute Distance</span>
            <span className="font-extrabold text-emerald-400">{weeklyKm} km / week</span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={weeklyKm}
            onChange={(e) => setWeeklyKm(Number(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Vehicle Fuel</label>
            <select
              value={currentFuel}
              onChange={(e) => setCurrentFuel(e.target.value)}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              <option value="petrol">Petrol Car (0.21 kg/km)</option>
              <option value="diesel">Diesel SUV (0.24 kg/km)</option>
              <option value="cng">CNG Car (0.16 kg/km)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Switch To Alternate Mode</label>
            <select
              value={alternateMode}
              onChange={(e) => setAlternateMode(e.target.value)}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              <option value="metro">Metro / Local Train</option>
              <option value="bus">Electric Public Bus</option>
              <option value="cycling">Cycling / Walking</option>
              <option value="electric">Electric Vehicle (EV)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculated Savings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{annualCO2Saved} kg</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Annual CO2 Saved</p>
        </div>

        <div className="rounded-2xl bg-teal-500/10 border border-teal-500/30 p-4 text-center">
          <p className="text-2xl font-black text-teal-400">₹{annualMoneySaved.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Est. Fuel Cost Saved</p>
        </div>

        <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-4 text-center">
          <p className="text-2xl font-black text-cyan-400">🌳 {equivalentTrees}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Trees Equivalent</p>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
