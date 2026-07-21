import { useState } from "react";

const quickPrompts = [
  "🚗 How to reduce car commute emissions?",
  "⚡ Petrol Car vs EV Footprint comparison",
  "🚩 Varanasi Ghats zero-plastic clean tips",
  "🎓 LPU Campus green habits & energy saving",
];

const botKnowledge = {
  car: "🚗 **Transport Insights**: Transport is often 50%+ of individual carbon footprint. Carpooling twice a week cuts 8.5 kg CO2/week. Keeping tires inflated & driving <60km/h improves fuel efficiency by 15%.",
  ev: "⚡ **Petrol vs EV**: Electric Vehicles emit ~70% less lifecycle CO2 than petrol cars, even on regular grid power. In India, 1 kWh EV charge = 0.04 kg CO2 vs Petrol 0.22 kg CO2 per km!",
  varanasi: "🚩 **Varanasi Ghats Drive**: Avoid single-use plastic cups at tea stalls near Assi & Dashashwamedh Ghats. Use terracotta Kulhads & pattal plates for local street food!",
  lpu: "🎓 **LPU Green Campus**: Walking between UniMall & Hostel Block 34 saves ~1.2 kg CO2 daily compared to auto-rickshaws. Turning off hostel room AC when away saves 3.5 kWh daily!",
  default: "🌿 I am your AI Eco-Advisor! Ask me anything about carbon calculations, food/travel factors, or regional sustainability drives.",
};

const EcoBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am EcoBot 🤖, your AI Sustainability Advisor. How can I help you reduce your carbon footprint today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response logic
    setTimeout(() => {
      let reply = botKnowledge.default;
      const lower = query.toLowerCase();

      if (lower.includes("car") || lower.includes("commute") || lower.includes("travel")) {
        reply = botKnowledge.car;
      } else if (lower.includes("ev") || lower.includes("petrol") || lower.includes("electric")) {
        reply = botKnowledge.ev;
      } else if (lower.includes("varanasi") || lower.includes("ghat")) {
        reply = botKnowledge.varanasi;
      } else if (lower.includes("lpu") || lower.includes("campus") || lower.includes("hostel")) {
        reply = botKnowledge.lpu;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-3 text-xs font-black text-slate-950 shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300 border border-emerald-300/40"
        >
          <span className="text-base animate-bounce">🤖</span>
          <span>Ask EcoBot AI</span>
        </button>
      )}

      {/* Interactive Chat Window Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0D1829] to-[#0A1628] p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-sm font-bold">
                🤖
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">EcoBot AI Advisor</h4>
                <p className="text-[10px] text-emerald-400 font-semibold">Online • Sustainability Assistant</p>
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
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-200 border border-slate-800"
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
              placeholder="Ask EcoBot a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs hover:scale-105 transition"
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
