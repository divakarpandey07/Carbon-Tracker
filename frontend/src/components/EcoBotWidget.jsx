import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const quickPrompts = [
  "Hii EcoBot 👋",
  "Summary of my footprint & logs 📊",
  "Platform Architecture & Tech Stack 📐",
  "How is CO2 calculated? (Viva Q&A) 🎯",
  "How Offset Marketplace & PDF Works? 🛍️",
  "Varanasi Ghats & LPU Campus Quests 🚩",
];

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
    `📐 Viva Q&A: Ask me about Platform Architecture!`,
    `🚗 Tip: Carpooling 2 days/week saves 8.5 kg CO2!`,
    `⚡ Tip: Switching to EV cuts 70% lifecycle emissions!`,
    `🚩 Varanasi Ghats: Join Assi Ghat zero-plastic drive!`,
    `🎓 LPU Campus: Save energy in hostel rooms today!`,
  ];

  // Auto rotate speech bubble every 4.5 seconds when closed
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
        ? `Greetings & Supreme Respects, Super Admin ${userName}! 🛡️ All carbon telemetry databases, provider verification queues, and architecture systems are operating at 100% efficiency under your command. How may I serve you today, Boss?`
        : `Hii ${userName}! 👋 I am EcoBot AI, your personal platform guide & viva assistant. Ask me anything about your footprint, website features, tech stack, or viva questions!`;

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
      let reply = "";

      // Detect language (Hindi / Hinglish vs English)
      const isHinglish =
        lower.includes("kya") ||
        lower.includes("kaise") ||
        lower.includes("batao") ||
        lower.includes("aap") ||
        lower.includes("kaam") ||
        lower.includes("karta") ||
        lower.includes("hai") ||
        lower.includes("hum") ||
        lower.includes("skte") ||
        lower.includes("kuch") ||
        lower.includes("chahiye") ||
        lower.includes("bhai") ||
        lower.includes("ho");

      // 1. Greetings
      if (
        lower.includes("hi") ||
        lower.includes("hii") ||
        lower.includes("hello") ||
        lower.includes("hey") ||
        lower.includes("namaste") ||
        lower.includes("kaise ho") ||
        lower.includes("greetings")
      ) {
        if (isAdmin) {
          reply = isHinglish
            ? `Hii aur Pranam Super Admin ${userName}! 🛡️ Aapka swagat hai. CarbonTrack ke sabhi server, database, aur admin controls bilkul smooth chal rahe hain, Boss!`
            : `Hii & Supreme Respects, Super Admin ${userName}! 🛡️ Always a honor to assist you. All platform telemetry and verified systems are active under your supervision, Boss!`;
        } else {
          reply = isHinglish
            ? `Hii ${userName}! 👋 Main bilkul mast hu! Aap bataiye, aaj website ke baare me kya jaan-na hai ya viva/architecture ka koi sawaal puchhna hai?`
            : `Hii ${userName}! 👋 Hope you are having a fantastic day. Ready to check your eco progress or ask any viva/architecture questions about the platform?`;
        }
      }

      // 2. Personal Stats & Footprint
      else if (
        lower.includes("stats") ||
        lower.includes("footprint") ||
        lower.includes("summary") ||
        lower.includes("my logs") ||
        lower.includes("mera score")
      ) {
        if (userStats && userStats.grandTotalCO2 !== undefined) {
          reply = isHinglish
            ? `${userName} ka Carbon Summary:\n• Total CO2 Emitted: ${userStats.grandTotalCO2} kg\n• Active Categories: ${userStats.breakdown?.map((b) => `${b._id} (${b.totalCO2}kg)`).join(", ") || "No logs yet"}.\nAap regular activity log karke rank badha sakte ho!`
            : `${userName}'s Carbon Summary:\n• Total Emitted: ${userStats.grandTotalCO2} kg CO2e\n• Active Breakdown: ${userStats.breakdown?.map((b) => `${b._id} (${b.totalCO2}kg)`).join(", ") || "No logs yet"}.\nKeep logging activities to maintain your streak!`;
        } else {
          reply = isHinglish
            ? `${userName}, abhi tak aapne koi log add nahi kiya hai. Dashboard se daily travel ya energy log karein!`
            : `${userName}, you haven't recorded any activity logs yet. Try logging your daily travel or energy use on the Dashboard!`;
        }
      }

      // 3. Platform Architecture & Tech Stack (Viva Q&A)
      else if (
        lower.includes("architecture") ||
        lower.includes("tech stack") ||
        lower.includes("workflow") ||
        lower.includes("framework") ||
        lower.includes("kaise bana hai") ||
        lower.includes("how it works") ||
        lower.includes("viva")
      ) {
        reply = isHinglish
          ? `CarbonTrack Platform Architecture (MERN Stack):\n• Frontend: React.js + TailwindCSS (Bio-Tech Obsidian Design System) + Recharts Graphs.\n• Backend: Node.js + Express.js REST API + JWT Authentication.\n• Database: MongoDB (Mongoose Schema Model for Users, Activities, Challenges, Marketplace, Orders).\n• Key Features: Smart Vehicle Specs Engine, 1-Click PDF Certificate Generator, CSV Data Exporter, Corporate Team Leaderboard.`
          : `CarbonTrack Platform Architecture (MERN Stack):\n• Frontend: React.js + TailwindCSS + Recharts interactive graphs.\n• Backend: Node.js + Express.js REST API + JWT Auth.\n• Database: MongoDB with schemas for Users, Activities, Challenges, Marketplace, & Orders.\n• Key Features: Smart Vehicle Engine, 1-Click PDF Carbon Certificates, CSV Data Export, & Team Leaderboards.`;
      }

      // 4. How CO2 is Calculated
      else if (
        lower.includes("calculate") ||
        lower.includes("formula") ||
        lower.includes("co2") ||
        lower.includes("calculation") ||
        lower.includes("hisab")
      ) {
        reply = isHinglish
          ? `Carbon Calculation Formula:\nEmission (kg CO2) = Activity Quantity x Emission Factor x Vehicle Multipliers.\nExample Factors:\n• Petrol Car: 0.21 kg CO2/km\n• Diesel SUV: 0.24 kg CO2/km\n• EV Electric: 0.04 kg CO2/km\n• Electricity: 0.82 kg CO2/kWh`
          : `Carbon Calculation Formula:\nEmission (kg CO2) = Activity Quantity x Emission Factor x Vehicle Metadata Multipliers.\nStandard Benchmark Factors:\n• Petrol Car: 0.21 kg CO2/km\n• Diesel SUV: 0.24 kg CO2/km\n• Electric EV: 0.04 kg CO2/km\n• Grid Power: 0.82 kg CO2/kWh`;
      }

      // 5. Marketplace, Orders & Certificates
      else if (
        lower.includes("marketplace") ||
        lower.includes("offset") ||
        lower.includes("certificate") ||
        lower.includes("order") ||
        lower.includes("khareed")
      ) {
        reply = isHinglish
          ? `Marketplace & Certificate Workflow:\n1. Provider verified offset project list karta hai.\n2. User marketplace se CO2 offset credit (e.g. 50 kg) khareedta hai.\n3. System automatically user ka net carbon score neutral kar deta hai.\n4. User My Orders page se 1-Click Official Verified PDF Certificate download ya print kar sakta hai!`
          : `Marketplace & Offset Certificate Workflow:\n1. Verified offset providers list green projects.\n2. Users purchase offset credits to neutralize emissions.\n3. Net carbon score updates automatically.\n4. Users can download or print an Official Verified PDF Offset Certificate from the My Orders page!`;
      }

      // 6. Regional & Campus Drives (Varanasi & LPU)
      else if (
        lower.includes("varanasi") ||
        lower.includes("lpu") ||
        lower.includes("ghat") ||
        lower.includes("campus")
      ) {
        reply = isHinglish
          ? `Regional Quests & Campus Drives:\n• Varanasi Ghats: Assi Ghat zero-plastic drive & terracotta Kulhad usage.\n• LPU Campus: UniMall to Block 34 walking challenge & Hostel room AC power saver drive.\nAap Challenges page par jaakar in quests ko accept karke Eco Points earn kar sakte ho!`
          : `Regional & Campus Quests:\n• Varanasi Ghats: Zero-plastic patrols near Assi & Dashashwamedh Ghats.\n• LPU Campus: Walking challenges between UniMall & Hostel blocks.\nAccept these quests on the Challenges page to earn Eco Points!`;
      }

      // 7. What can you do / General website capabilities
      else if (
        lower.includes("what can you do") ||
        lower.includes("kya kar sakte ho") ||
        lower.includes("features") ||
        lower.includes("help")
      ) {
        reply = isHinglish
          ? `CarbonTrack AI Advisor capabilities:\n1. Daily carbon logging & Smart vehicle calculations\n2. Real-time footprint trend graphs & AI tips\n3. CSV Telemetry data export & PDF Carbon Offset Certificates\n4. LPU Campus & Varanasi regional quests & Leaderboard ranking\n5. Full Viva / Architecture Q&A guidance for project presentation!`
          : `CarbonTrack AI Capabilities:\n1. Daily carbon logging & Smart vehicle multiplier engine\n2. Live trend graphs & real-world equivalent insights\n3. CSV Telemetry data export & 1-Click PDF Carbon Certificates\n4. LPU Campus & Varanasi regional drives with global leaderboard\n5. Complete Architecture & Viva Q&A assistance!`;
      }

      // Fallback response
      else {
        reply = isHinglish
          ? `${userName}, main aapki madad ke liye tayyar hu! Aap mujhse Website Architecture, CO2 Calculation Formula, PDF Certificates, ya Viva Q&A ke baare me puchh sakte ho.`
          : `${userName}, I am standing by to assist! Ask me about Platform Architecture, CO2 Calculation Formulas, Offset Certificates, or Viva Q&A.`;

        if (isAdmin) {
          reply = `Super Admin ${userName}, your query "${query}" has been logged into the console. Standing by for your commands, Boss!`;
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 400);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Auto-Rotating Floating Speech Bubble when Closed */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="mb-2.5 max-w-[270px] cursor-pointer rounded-2xl bg-[#090E1A]/95 backdrop-blur-xl border border-emerald-500/40 p-3.5 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-emerald-400 group animate-pulse"
        >
          <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Eco AI Assistant
            </span>
            <span className="text-[9px] text-slate-400 font-semibold group-hover:text-emerald-300">Tap to chat →</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-snug">
            {bubbleTips[bubbleIndex]}
          </p>
        </div>
      )}

      {/* Floating Toggle Button (Clean name without brackets) */}
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
                  {isAdmin ? "Super Admin Command Console" : "EcoBot AI & Viva Assistant"}
                </h4>
                <p className={`text-[10px] font-semibold ${isAdmin ? "text-amber-400" : "text-emerald-400"}`}>
                  {isAdmin ? "🛡️ VIP Command Center Active" : "Online • Multilingual AI Advisor"}
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
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
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
              placeholder={`Ask EcoBot in Hindi, Hinglish or English...`}
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
