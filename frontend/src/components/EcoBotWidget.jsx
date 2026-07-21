import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const quickPrompts = [
  "Hii EcoBot 👋",
  "Summary of my footprint & logs 📊",
  "How to reduce car commute emissions? 🚗",
  "Petrol Car vs EV Footprint comparison ⚡",
  "Varanasi Ghats zero-plastic clean tips 🚩",
  "LPU Campus green habits & energy saving 🎓",
];

const botKnowledge = {
  car: "Transport Insights: Transport is often 50%+ of individual carbon footprint. Carpooling twice a week cuts 8.5 kg CO2/week. Keeping tires inflated and driving under 60 km/h improves fuel efficiency by 15%.",
  ev: "Petrol vs EV: Electric Vehicles emit around 70% less lifecycle CO2 than petrol cars, even on regular grid power. In India, 1 kWh EV charge = 0.04 kg CO2 vs Petrol 0.22 kg CO2 per km!",
  varanasi: "Varanasi Ghats Drive: Avoid single-use plastic cups at tea stalls near Assi & Dashashwamedh Ghats. Use terracotta Kulhads & pattal plates for local street food!",
  lpu: "LPU Green Campus: Walking between UniMall & Hostel Block 34 saves around 1.2 kg CO2 daily compared to auto-rickshaws. Turning off hostel room AC when away saves 3.5 kWh daily!",
  default: "I am your AI Eco-Advisor! Ask me anything about carbon calculations, food/travel factors, or regional sustainability drives.",
};

const EcoBotWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [bubbleIndex, setBubbleIndex] = useState(0);

  const isAdmin = user?.role === "admin";
  const userName = user?.name || "Friend";

  const bubbleTips = [
    `Hii ${userName}! 👋 Want to check your carbon footprint?`,
    `🚗 Tip: Carpooling 2 days/week saves 8.5 kg CO2!`,
    `⚡ Tip: Switching to EV cuts 70% lifecycle emissions!`,
    `🚩 Varanasi Ghats: Join Assi Ghat zero-plastic drive!`,
    `🎓 LPU Campus: Save energy in hostel rooms today!`,
    `🌱 Neutralize your footprint with certified offsets!`,
  ];

  // Auto rotate speech bubble every 4 seconds when closed
  useEffect(() => {
    const timer = setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % bubbleTips.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bubbleTips.length]);

  // Initialize personalized greeting without raw markdown stars or hashes
  useEffect(() => {
    if (user) {
      const greeting = isAdmin
        ? `Greetings & Supreme Respects, Super Admin ${userName}! 🛡️ All carbon telemetry databases, provider verification queues, and marketplace systems are running at 100% efficiency under your command. How may I serve you today, Boss?`
        : `Hii ${userName}! 👋 I am EcoBot, your personal AI Sustainability Advisor. I am monitoring your logged activities. How can I help you reduce your carbon footprint today?`;

      setMessages([{ sender: "bot", text: greeting }]);
    }
  }, [user, isAdmin, userName]);

  // Fetch live stats for personalized responses
  useEffect(() => {
    if (user) {
      api.get("/footprint/total")
        .then((res) => setUserStats(res.data))
        .catch(() => {});
    }
  }, [user]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = botKnowledge.default;

      if (lower.includes("hi") || lower.includes("hii") || lower.includes("hello") || lower.includes("hey") || lower.includes("namaste") || lower.includes("greetings")) {
        reply = isAdmin
          ? `Hii & Supreme Respects, Super Admin ${userName}! 🛡️ Always a pleasure to assist you. All platform telemetry and verified providers are active under your supervision, Boss!`
          : `Hii ${userName}! 👋 Hope you are having a wonderful day. Ready to check your eco progress or learn quick carbon saving tips?`;
      } else if (lower.includes("stats") || lower.includes("footprint") || lower.includes("summary") || lower.includes("my logs")) {
        if (userStats && userStats.grandTotalCO2 !== undefined) {
          reply = isAdmin
            ? `Super Admin ${userName}'s Telemetry Overview:\n• Total CO2 Emitted: ${userStats.grandTotalCO2} kg\n• Logged Categories: ${userStats.breakdown?.length || 0} active categories.\nEverything is fully synchronized, Boss!`
            : `${userName}'s Carbon Summary:\n• Total Emitted: ${userStats.grandTotalCO2} kg CO2e\n• Active Breakdown: ${userStats.breakdown?.map((b) => `${b._id} (${b.totalCO2}kg)`).join(", ") || "No logs yet"}.\nKeep logging activities to maintain your streak!`;
        } else {
          reply = `${userName}, you haven't recorded any activity logs yet. Try logging your daily travel or energy use!`;
        }
      } else if (lower.includes("car") || lower.includes("commute") || lower.includes("travel")) {
        reply = isAdmin
          ? `For Super Admin ${userName}: ` + botKnowledge.car
          : botKnowledge.car;
      } else if (lower.includes("ev") || lower.includes("petrol") || lower.includes("electric")) {
        reply = isAdmin
          ? `Special EV telemetry briefing for Super Admin ${userName}: ` + botKnowledge.ev
          : botKnowledge.ev;
      } else if (lower.includes("varanasi") || lower.includes("ghat")) {
        reply = botKnowledge.varanasi;
      } else if (lower.includes("lpu") || lower.includes("campus") || lower.includes("hostel")) {
        reply = botKnowledge.lpu;
      } else {
        reply = isAdmin
          ? `Super Admin ${userName}, your query "${query}" has been processed. I am standing by to assist with any platform management!`
          : `${userName}, I'm here to help! ${botKnowledge.default}`;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 450);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Auto-Rotating Floating Speech Bubble when Closed */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="mb-2.5 max-w-[260px] cursor-pointer rounded-2xl bg-[#090E1A]/95 backdrop-blur-xl border border-emerald-500/40 p-3.5 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-emerald-400 group animate-pulse"
        >
          <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Eco Intelligence
            </span>
            <span className="text-[9px] text-slate-400 font-semibold group-hover:text-emerald-300">Tap to chat →</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-snug">
            {bubbleTips[bubbleIndex]}
          </p>
        </div>
      )}

      {/* Floating Toggle Button (No brackets around name) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 rounded-full px-5 py-3.5 text-xs font-black text-slate-950 shadow-2xl transition-all duration-300 border ${
            isAdmin
              ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 border-amber-300 shadow-amber-500/40 hover:scale-105"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-emerald-300/40 shadow-emerald-500/40 hover:scale-105"
          }`}
        >
          <span className="text-base animate-bounce">{isAdmin ? "👑" : "🤖"}</span>
          <span>{isAdmin ? "Admin AI Console" : "Ask EcoBot AI"}</span>
        </button>
      )}

      {/* Interactive Chat Window Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Chat Header */}
          <div className={`p-4 border-b border-slate-800 flex items-center justify-between ${
            isAdmin
              ? "bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b-amber-500/30"
              : "bg-gradient-to-r from-[#0D1829] to-[#0A1628]"
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${
                isAdmin ? "bg-amber-500/20 border-amber-400 text-amber-400" : "bg-emerald-500/20 border-emerald-400 text-emerald-400"
              }`}>
                {isAdmin ? "👑" : "🤖"}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {isAdmin ? "Super Admin Command Console" : "EcoBot AI Advisor"}
                </h4>
                <p className={`text-[10px] font-semibold ${isAdmin ? "text-amber-400" : "text-emerald-400"}`}>
                  {isAdmin ? "🛡️ VIP Command Center Active" : "Online • Personal AI Assistant"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-bold text-sm w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold"
                      : isAdmin
                      ? "bg-slate-900 text-amber-200 border border-amber-500/30 shadow-lg font-medium"
                      : "bg-slate-900 text-slate-200 border border-slate-800 font-medium"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[10px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded-full font-medium shrink-0 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder={`Ask EcoBot, ${userName}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className={`px-4 py-2 rounded-xl text-slate-950 font-extrabold text-xs hover:scale-105 transition ${
                isAdmin
                  ? "bg-gradient-to-r from-amber-400 to-yellow-400"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoBotWidget;
