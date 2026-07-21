import { useMemo } from "react";

const EcoInsights = ({ activities }) => {
  const stats = useMemo(() => {
    const totalCO2 = activities.reduce((acc, curr) => acc + (curr.co2Emitted || 0), 0);

    const categoryTotals = activities.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + (curr.co2Emitted || 0);
      return acc;
    }, {});

    const topCategory = Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      "transport"
    );

    const treesNeeded = Math.max(1, Math.ceil(totalCO2 / 20));
    const phoneCharges = Math.round(totalCO2 * 121);
    const bulbHours = Math.round(totalCO2 * 85);

    return {
      totalCO2: Math.round(totalCO2 * 10) / 10,
      topCategory,
      treesNeeded,
      phoneCharges,
      bulbHours,
      categoryTotals,
    };
  }, [activities]);

  const weeklyBudget = 50; // kg CO2 budget benchmark
  const budgetUsedPercent = Math.min(100, Math.round((stats.totalCO2 / weeklyBudget) * 100));

  return (
    <div className="space-y-6">
      {/* Real-world Carbon Impact Converter */}
      <div className="obsidian-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <h3 className="text-base font-bold text-white tracking-tight">Real-World Equivalents</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Live Conversion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-950/80 border border-emerald-500/20 p-4 text-center hover:border-emerald-500/40 transition-all">
            <span className="text-2xl mb-1 block">🌳</span>
            <p className="text-2xl font-black text-emerald-400">{stats.treesNeeded}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Trees needed to absorb (1 yr)</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-teal-500/20 p-4 text-center hover:border-teal-500/40 transition-all">
            <span className="text-2xl mb-1 block">📱</span>
            <p className="text-2xl font-black text-teal-400">{stats.phoneCharges.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Smartphone full charges</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-cyan-500/20 p-4 text-center hover:border-cyan-500/40 transition-all">
            <span className="text-2xl mb-1 block">💡</span>
            <p className="text-2xl font-black text-cyan-400">{stats.bulbHours.toLocaleString()} hrs</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">LED Lightbulb continuous run</p>
          </div>
        </div>
      </div>

      {/* AI Smart Tip & Weekly Budget Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic AI Tip */}
        <div className="obsidian-card p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-slate-950">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🤖</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {stats.topCategory === "transport" ? (
                <>
                  <strong className="text-emerald-300">Transport</strong> is your primary carbon driver. Replacing 2 petrol car trips with electric/bus or cycling saves ~<span className="text-emerald-400 font-bold">8.5 kg CO2</span> this week!
                </>
              ) : stats.topCategory === "food" ? (
                <>
                  <strong className="text-amber-300">Food & Meat</strong> meals account for your highest footprint. Opting for plant-based meals 2 days a week cuts up to <span className="text-emerald-400 font-bold">11 kg CO2</span>.
                </>
              ) : (
                <>
                  Your emissions are well-balanced! Consistently logging activities unlocks rank boosts on the community leaderboard.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Potential Weekly Reduction</span>
            <span className="font-bold text-emerald-400">-25% CO2</span>
          </div>
        </div>

        {/* Weekly Carbon Budget */}
        <div className="obsidian-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Weekly Carbon Budget</span>
              </div>
              <span className="text-xs font-bold text-white">
                {stats.totalCO2} / {weeklyBudget} kg
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">Recommended personal weekly emission allowance benchmark.</p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  budgetUsedPercent > 80 ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-teal-400"
                }`}
                style={{ width: `${budgetUsedPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Budget Status</span>
            <span className={`font-bold ${budgetUsedPercent > 80 ? "text-amber-400" : "text-emerald-400"}`}>
              {budgetUsedPercent}% Used ({weeklyBudget - stats.totalCO2 > 0 ? (weeklyBudget - stats.totalCO2).toFixed(1) : 0} kg left)
            </span>
          </div>
        </div>
      </div>

      {/* Unlocked Badges Section */}
      <div className="obsidian-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎖️</span>
            <h3 className="text-base font-bold text-white tracking-tight">Eco Badges & Achievements</h3>
          </div>
          <span className="text-xs text-slate-400">4 Unlocked</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🌱</span>
            <p className="text-xs font-bold text-white">First Log</p>
            <p className="text-[10px] text-emerald-400 font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-teal-500/30 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🚗</span>
            <p className="text-xs font-bold text-white">Smart Commuter</p>
            <p className="text-[10px] text-teal-400 font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-cyan-500/30 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">⚡</span>
            <p className="text-xs font-bold text-white">Power Saver</p>
            <p className="text-[10px] text-cyan-400 font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-amber-500/30 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🏆</span>
            <p className="text-xs font-bold text-white">Contender</p>
            <p className="text-[10px] text-amber-400 font-bold">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoInsights;
