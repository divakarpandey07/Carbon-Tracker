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
      const q = query.toLowerCase().trim();

      // ── Language detect ──────────────────────────────────────────────────────
      const hindiWords = ["kya","kaise","batao","aap","kaam","karta","hai","hum","skte","kuch","chahiye","bhai","ho","kaisa","iska","karo","kr","me","mujhe","mera","meri","nahi","haan","theek","website","platform","samjhao","dikhao","dekho","puchh","puchho","btao","kar","jo","ye","yeh","woh","wahi","acha","accha","janana","janna","lagao","laga","bol","bolo","kitna","kitne","kyun","kyunki","toh","to","bhi","sirf","sab","abhi","pehle","baad","kab","kahan","kon","kaun"];
      const isHinglish = hindiWords.some((w) => q.includes(w));

      // ── Matchers ─────────────────────────────────────────────────────────────
      const match = (...terms) => terms.some((t) => q.includes(t));

      let reply = "";

      // 1. Greetings
      if (match("hi","hii","hello","hey","namaste","kaise ho","greet","sup","howdy","hola","pranam","namaskar","good morning","good evening","good afternoon")) {
        if (isAdmin) {
          reply = isHinglish
            ? `Pranam aur Supreme Swagat, Super Admin ${userName}! 🛡️\nCarbonTrack ke sabhi telemetry servers, database aur admin controls 100% active hain. Bataiye Boss, aaj kya karna hai?`
            : `Hii & Supreme Respects, Super Admin ${userName}! 🛡️\nAll platform systems, admin controls & carbon telemetry databases are fully operational. How may I assist you today, Boss?`;
        } else {
          reply = isHinglish
            ? `Hii ${userName}! 👋 Main bilkul theek hoon!\nAaj kya jaanna chahte ho — apna CO2 summary, viva questions, ya platform ke kisi feature ke baare mein?`
            : `Hii ${userName}! 👋 Great to see you!\nAsk me anything — your carbon footprint stats, platform architecture, viva Q&A, or how any feature works!`;
        }
      }

      // 2. How it works / kaise kaam karta hai / workflow
      else if (match("kaise kaam","how it work","kaam karta","workflow","how does","kaise chalta","how does this","how does the","kaise use","use kare","use karna","samjhao","explain","work karta","kaam krta")) {
        reply = isHinglish
          ? `CarbonTrack kaise kaam karta hai:\n\n1. Log in karo aur Dashboard par aao.\n2. Apni daily activities log karo (travel, electricity, food, shopping).\n3. System automatically CO2 calculate karta hai — formula: Activity Qty × Emission Factor.\n4. Footprint Summary aur Trend Graph real-time update hote hain.\n5. Challenges join karo → Eco Points kamao → Leaderboard mein rank karo.\n6. Marketplace se CO2 offset khareedho → Verified Certificate download karo!\n\nKoi bhi step detail mein samjhana ho toh bolo!`
          : `How CarbonTrack works — step by step:\n\n1. Login and open the Dashboard.\n2. Log daily activities (travel, electricity, food, shopping).\n3. System auto-calculates CO2: Activity Qty × Emission Factor.\n4. View real-time Footprint Summary and Trend Graphs.\n5. Join Challenges → Earn Eco Points → Rank on Leaderboard.\n6. Buy CO2 offsets from Marketplace → Download Verified Certificate!\n\nAsk me about any specific step for more detail!`;
      }

      // 3. Personal Stats & Footprint
      else if (match("stats","footprint","summary","my log","mera score","mera data","mera footprint","my footprint","meri activity","mere activities","kitna co2","how much co2","my co2","apna")) {
        if (userStats && userStats.grandTotalCO2 !== undefined) {
          const bdwn = userStats.breakdown?.map((b) => `   • ${b._id}: ${b.totalCO2} kg CO2`).join("\n") || "   • Koi breakdown nahi";
          reply = isHinglish
            ? `${userName} ka Live Carbon Summary 📊\n\nTotal CO2 Emitted: ${userStats.grandTotalCO2} kg\n\nCategory Breakdown:\n${bdwn}\n\nLeaderboard par apna rank badhane ke liye aur activities log karo!`
            : `${userName}'s Live Carbon Summary 📊\n\nTotal CO2 Emitted: ${userStats.grandTotalCO2} kg CO2e\n\nCategory Breakdown:\n${bdwn}\n\nKeep logging to improve your leaderboard rank!`;
        } else {
          reply = isHinglish
            ? `${userName}, abhi tak koi activity log nahi ki hai. Dashboard par jao aur daily travel, electricity ya shopping log karo — score turant update ho jaayega!`
            : `${userName}, no activity logs yet! Head to the Dashboard and log your daily travel, electricity, or food — your score updates instantly!`;
        }
      }

      // 4. Architecture / Tech Stack / Viva
      else if (match("architecture","tech stack","framework","mern","react","node","express","mongo","database","backend","frontend","kaise bana","built with","technology","technologies","tech","viva","project","developed","stack")) {
        reply = isHinglish
          ? `CarbonTrack Platform Architecture (MERN Stack) 📐\n\nFrontend:\n  • React.js + TailwindCSS (Bio-Tech Obsidian Dark Design)\n  • Recharts — interactive CO2 trend graphs\n\nBackend:\n  • Node.js + Express.js — REST API\n  • JWT Authentication (secure token-based login)\n\nDatabase:\n  • MongoDB + Mongoose\n  • Collections: Users, Activities, Challenges, Marketplace, Orders\n\nSpecial Features:\n  • Smart Vehicle Emission Engine (Petrol/Diesel/EV factors)\n  • 1-Click Canvas PNG + PDF Certificate Generator\n  • Multilingual AI Chatbot (Hindi/Hinglish/English)\n  • Regional Quests: Varanasi Ghats + LPU Campus`
          : `CarbonTrack Platform Architecture (MERN Stack) 📐\n\nFrontend:\n  • React.js + TailwindCSS — Bio-Tech Obsidian Dark UI\n  • Recharts — live CO2 trend graphs\n\nBackend:\n  • Node.js + Express.js — RESTful API\n  • JWT Authentication — secure login sessions\n\nDatabase:\n  • MongoDB + Mongoose\n  • Collections: Users, Activities, Challenges, Marketplace, Orders\n\nKey Features:\n  • Smart Vehicle Emission Engine (Petrol/Diesel/EV)\n  • 1-Click PNG + PDF Certificate Generator\n  • Multilingual AI Chatbot (Hindi/Hinglish/English)\n  • Regional Quests: Varanasi Ghats + LPU Campus`;
      }

      // 5. CO2 Calculation / Formula
      else if (match("calculat","formula","co2","carbon","hisab","co 2","emission","factor","kitna","how much","emi")) {
        reply = isHinglish
          ? `CO2 Calculation Formula 🎯\n\nFormula:\nEmission (kg CO2) = Quantity × Emission Factor × Vehicle Multiplier\n\nExample Factors:\n  • Petrol Car → 0.21 kg CO2/km\n  • Diesel SUV → 0.24 kg CO2/km\n  • Electric EV → 0.04 kg CO2/km\n  • Electricity → 0.82 kg CO2/kWh\n  • Meat/Food → 3.0 kg CO2/kg\n  • Air Travel → 0.255 kg CO2/km\n\nUdaharan: Agar aap 50 km petrol car chalate ho:\n50 × 0.21 = 10.5 kg CO2`
          : `CO2 Calculation Formula 🎯\n\nFormula:\nEmission (kg CO2) = Quantity × Emission Factor × Vehicle Multiplier\n\nKey Emission Factors:\n  • Petrol Car → 0.21 kg CO2/km\n  • Diesel SUV → 0.24 kg CO2/km\n  • Electric EV → 0.04 kg CO2/km\n  • Electricity → 0.82 kg CO2/kWh\n  • Meat/Food → 3.0 kg CO2/kg\n  • Air Travel → 0.255 kg CO2/km\n\nExample: 50km petrol drive = 50 × 0.21 = 10.5 kg CO2`;
      }

      // 6. Marketplace / Certificate / Offset
      else if (match("marketplace","offset","certificate","order","khareed","buy","purchase","download","pdf","neutralize","neutral")) {
        reply = isHinglish
          ? `Marketplace & Certificate Workflow 🛍️\n\n1. Marketplace page par jao.\n2. Verified green project choose karo (e.g. Mangrove Reforestation).\n3. CO2 offset credit khareedho (jitna aapka footprint hai).\n4. Net carbon score automatically neutral ho jaata hai.\n5. My Orders page se Official Verified Certificate:\n   → PNG Image download karo, YA\n   → PDF print karo (browser print dialog)\n\nCertificate mein aapka naam, total CO2, transaction reference, aur verified seal hota hai!`
          : `Marketplace & Certificate Workflow 🛍️\n\n1. Go to the Marketplace page.\n2. Choose a verified green offset project.\n3. Purchase CO2 offset credits matching your footprint.\n4. Net carbon score auto-neutralizes.\n5. From My Orders page — download Official Certificate as:\n   → PNG Image (Download PNG button), OR\n   → PDF via browser print dialog\n\nThe certificate shows your name, total CO2, transaction ref & verified seal!`;
      }

      // 7. Leaderboard
      else if (match("leaderboard","rank","ranking","top","score","points","eco point","challenge","position")) {
        reply = isHinglish
          ? `Leaderboard & Eco Points System 🏆\n\nTop Rankings:\n  🥇 #1: Divakar Pandey — 1250 pts (Super Admin)\n  🥈 #2: Gungun — 980 pts\n  🥉 #3: Ayush — 850 pts\n  #4: Vanshul — 720 pts\n  #5: Rahul — 610 pts\n\nPoints kaise kamao:\n  • Challenges complete karo → direct points milte hain\n  • Ek challenge = platform pe set pointsReward value\n  • Leaderboard page par dusron ka profile bhi dekh sakte ho!`
          : `Leaderboard & Eco Points System 🏆\n\nCurrent Top Rankings:\n  🥇 #1: Divakar Pandey — 1250 pts (Super Admin)\n  🥈 #2: Gungun — 980 pts\n  🥉 #3: Ayush — 850 pts\n  #4: Vanshul — 720 pts\n  #5: Rahul — 610 pts\n\nHow to earn points:\n  • Complete Challenges on the Challenges page\n  • Each challenge has a pointsReward value\n  • Click any user on Leaderboard to view their public profile!`;
      }

      // 8. Regional Quests
      else if (match("varanasi","ghat","lpu","lovely professional","campus","regional","quest","drive","assi","dashashwamedh")) {
        reply = isHinglish
          ? `Regional & Campus Quests 🚩\n\nVaranasi Ghats:\n  • Assi Ghat & Dashashwamedh Ghat pe zero-plastic patrol\n  • Terracotta kulhad ka use promote karna\n  • Ganga cleanup drive participation\n\nLPU Campus:\n  • UniMall se Block 34 tak walking challenge\n  • Hostel room AC energy saver drive\n  • Campus cycling initiative\n\nChallenges page par jao aur in quests ko accept karo — Eco Points direct milenge!`
          : `Regional & Campus Quests 🚩\n\nVaranasi Ghats:\n  • Zero-plastic patrols near Assi & Dashashwamedh Ghats\n  • Promoting terracotta kulhad usage along the ghats\n  • Ganga river cleanup drive participation\n\nLPU Campus:\n  • Walking challenge: UniMall to Block 34\n  • Hostel room AC energy saver drive\n  • Campus cycling initiative\n\nGo to the Challenges page to accept these quests and earn Eco Points!`;
      }

      // 9. What can you do / capabilities / features
      else if (match("what can","kya kar sakte","feature","help","capabilities","kya kya","what do you","kya hain","apna kaam","kya karta hai","tumhara kaam","tera kaam","aapka kaam","your job","your work","about you","tum kaun","tu kaun","aap kaun","who are you","kaun ho")) {
        reply = isHinglish
          ? `Main EcoBot AI hoon — CarbonTrack ka Multilingual Advisor! 🤖\n\nMain ye sab kar sakta hoon:\n  1. Aapka Carbon Footprint summary dena (real data)\n  2. CO2 calculation formula samjhana\n  3. Platform Architecture & Tech Stack explain karna\n  4. Marketplace & Certificate workflow batana\n  5. Varanasi Ghats & LPU Campus quests ki info dena\n  6. Leaderboard rankings batana\n  7. Viva/project questions ke jawab dena\n  8. Hindi, Hinglish ya English — teeno mein baat karna!\n\nBas koi bhi sawaal puchho — main jawab dunga!`
          : `I'm EcoBot AI — CarbonTrack's Multilingual Smart Advisor! 🤖\n\nHere's what I can do:\n  1. Give your real-time Carbon Footprint summary\n  2. Explain CO2 calculation formulas & vehicle factors\n  3. Walk you through Platform Architecture & Tech Stack\n  4. Explain Marketplace & Certificate workflow\n  5. Info on Varanasi Ghats & LPU Campus quests\n  6. Current Leaderboard rankings\n  7. Answer Viva/project presentation questions\n  8. Respond in Hindi, Hinglish, or English!\n\nJust ask me anything!`;
      }

      // 10. Dashboard / how to log
      else if (match("dashboard","log kare","log karo","activity","kaise log","how to log","add activity","activity kaise","log activity","daily log")) {
        reply = isHinglish
          ? `Dashboard par Activity Log kaise karo 📋\n\n1. Dashboard page par jao.\n2. Left side mein Activity Form dikhega.\n3. Category chuno: Transport, Electricity, Food, Shopping, etc.\n4. Sub-type chuno (e.g. Petrol Car, AC, Chicken).\n5. Quantity bharo (km, kWh, kg — category ke hisaab se).\n6. "Log Activity" button dabaao.\n7. CO2 automatically calculate hoga aur graph update ho jaayega!\n\nJitna zyada log karoge, utna accurate aapka footprint dikhega.`
          : `How to log activities on Dashboard 📋\n\n1. Go to the Dashboard page.\n2. Find the Activity Form on the left side.\n3. Select Category: Transport, Electricity, Food, Shopping, etc.\n4. Choose sub-type (e.g. Petrol Car, AC, Chicken).\n5. Enter Quantity (km / kWh / kg — depends on category).\n6. Click "Log Activity".\n7. CO2 is auto-calculated and graphs update instantly!\n\nThe more you log, the more accurate your footprint tracking!`;
      }

      // 11. Tips / suggestions
      else if (match("tip","suggestion","reduce","bachao","save","improve","better","eco","green","planet","help","kya karu","kya karna","advice")) {
        reply = isHinglish
          ? `Top Eco Tips 🌿\n\n1. Petrol car ki jagah EV ya cycling use karo — 70% emissions save!\n2. AC 1°C badhaao → 6% electricity save hoti hai.\n3. Meat consumption kam karo — 1 kg beef = 27 kg CO2!\n4. Carpooling 2 din/week = ~8.5 kg CO2 save per month.\n5. LED bulbs use karo — 75% less electricity.\n6. Short flights ki jagah train lo — 90% kam emissions!\n7. Reusable bags & bottles use karo.\n\nChallenges page par in tips se related quests bhi hain!`
          : `Top Eco Tips for Reducing Your Carbon Footprint 🌿\n\n1. Switch to EV or cycling — saves 70% emissions vs petrol!\n2. Raise AC by 1°C → saves 6% electricity.\n3. Reduce meat — 1 kg beef = 27 kg CO2!\n4. Carpool 2 days/week = ~8.5 kg CO2 saved per month.\n5. Use LED bulbs — 75% less electricity than incandescent.\n6. Take trains over short flights — 90% fewer emissions!\n7. Always use reusable bags & bottles.\n\nFind related eco challenges on the Challenges page!`;
      }

      // Fallback — smart, not "query logged"
      else {
        if (isHinglish) {
          reply = `${userName}, samjha! Lekin mujhe apni capabilities ke andar jawab dena hota hai. 😊\n\nAap mujhse ye puchh sakte ho:\n  • "Kaise kaam karta hai ye platform?"\n  • "Mera CO2 kitna hai?"\n  • "CO2 formula kya hai?"\n  • "Architecture explain karo"\n  • "Leaderboard mein kaun top par hai?"\n  • "Certificate kaise download hoga?"\n  • "Eco tips batao"\n\nKoi bhi topic choose karo!`;
        } else {
          reply = `Got it, ${userName}! Let me help you better. Here's what I can answer:\n\n  • "How does this platform work?"\n  • "What is my current CO2 footprint?"\n  • "Explain the CO2 calculation formula"\n  • "Tell me about the architecture"\n  • "Who is on top of the leaderboard?"\n  • "How do I download a certificate?"\n  • "Give me eco tips"\n\nJust pick any topic and ask!`;
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 350);
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
