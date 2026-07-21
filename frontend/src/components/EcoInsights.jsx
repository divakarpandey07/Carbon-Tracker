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
      <div className="eco-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <h3 className="font-serif text-xl font-bold text-[#0F2D1E] tracking-tight">Real-World Equivalents</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E] bg-[#EAF2E9] border border-emerald-900/15 px-3 py-1 rounded-full">
            Live Conversion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border border-emerald-950/10 p-4 text-center shadow-xs">
            <span className="text-2xl mb-1 block">🌳</span>
            <p className="text-2xl font-black text-[#0F2D1E]">{stats.treesNeeded}</p>
            <p className="text-[11px] text-[#557560] font-bold mt-0.5">Trees needed to absorb (1 yr)</p>
          </div>

          <div className="rounded-2xl bg-white border border-emerald-950/10 p-4 text-center shadow-xs">
            <span className="text-2xl mb-1 block">📱</span>
            <p className="text-2xl font-black text-[#0F2D1E]">{stats.phoneCharges.toLocaleString()}</p>
            <p className="text-[11px] text-[#557560] font-bold mt-0.5">Smartphone full charges</p>
          </div>

          <div className="rounded-2xl bg-white border border-emerald-950/10 p-4 text-center shadow-xs">
            <span className="text-2xl mb-1 block">💡</span>
            <p className="text-2xl font-black text-[#0F2D1E]">{stats.bulbHours.toLocaleString()} hrs</p>
            <p className="text-[11px] text-[#557560] font-bold mt-0.5">LED Lightbulb continuous run</p>
          </div>
        </div>
      </div>

      {/* AI Smart Tip & Weekly Budget Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic AI Tip */}
        <div className="eco-card p-6 flex flex-col justify-between bg-gradient-to-br from-[#EAF2E9] to-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🤖</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A2B]">AI Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A3022] leading-relaxed font-medium">
              {stats.topCategory === "transport" ? (
                <>
                  <strong className="text-[#0F2D1E]">Transport</strong> is your primary carbon driver. Replacing 2 petrol car trips with electric/bus or cycling saves ~<span className="text-[#0F2D1E] font-extrabold">8.5 kg CO2</span> this week!
                </>
              ) : stats.topCategory === "food" ? (
                <>
                  <strong className="text-[#C96A2B]">Food & Meat</strong> meals account for your highest footprint. Opting for plant-based meals 2 days a week cuts up to <span className="text-[#0F2D1E] font-extrabold">11 kg CO2</span>.
                </>
              ) : (
                <>
                  Your emissions are well-balanced! Consistently logging activities unlocks rank boosts on the community leaderboard.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-950/10 flex items-center justify-between text-xs text-[#557560]">
            <span>Potential Weekly Reduction</span>
            <span className="font-extrabold text-[#0F2D1E]">-25% CO2</span>
          </div>
        </div>

        {/* Weekly Carbon Budget */}
        <div className="eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2D1E]">Weekly Carbon Budget</span>
              </div>
              <span className="text-xs font-black text-[#0F2D1E]">
                {stats.totalCO2} / {weeklyBudget} kg
              </span>
            </div>

            <p className="text-xs text-[#557560] mb-4">Recommended personal weekly emission allowance benchmark.</p>

            {/* Progress Bar */}
            <div className="w-full bg-[#EAF2E9] rounded-full h-3 p-0.5 border border-emerald-950/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  budgetUsedPercent > 80 ? "bg-[#C96A2B]" : "bg-[#0F2D1E]"
                }`}
                style={{ width: `${budgetUsedPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-950/10 flex items-center justify-between text-xs">
            <span className="text-[#557560]">Budget Status</span>
            <span className={`font-bold ${budgetUsedPercent > 80 ? "text-[#C96A2B]" : "text-[#0F2D1E]"}`}>
              {budgetUsedPercent}% Used ({weeklyBudget - stats.totalCO2 > 0 ? (weeklyBudget - stats.totalCO2).toFixed(1) : 0} kg left)
            </span>
          </div>
        </div>
      </div>

      {/* Unlocked Badges Section */}
      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎖️</span>
            <h3 className="font-serif text-lg font-bold text-[#0F2D1E] tracking-tight">Eco Badges & Achievements</h3>
          </div>
          <span className="text-xs text-[#557560]">4 Unlocked</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🌱</span>
            <p className="text-xs font-bold text-[#0F2D1E]">First Log</p>
            <p className="text-[10px] text-[#2D5A39] font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🚗</span>
            <p className="text-xs font-bold text-[#0F2D1E]">Smart Commuter</p>
            <p className="text-[10px] text-[#2D5A39] font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">⚡</span>
            <p className="text-xs font-bold text-[#0F2D1E]">Power Saver</p>
            <p className="text-[10px] text-[#2D5A39] font-bold">Unlocked</p>
          </div>

          <div className="rounded-2xl bg-[#EAF2E9] border border-emerald-900/15 p-3 text-center flex flex-col items-center">
            <span className="text-2xl mb-1">🏆</span>
            <p className="text-xs font-bold text-[#0F2D1E]">Contender</p>
            <p className="text-[10px] text-[#C96A2B] font-bold">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoInsights;
