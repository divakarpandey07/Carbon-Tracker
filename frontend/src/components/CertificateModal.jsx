import { useRef } from "react";

const CertificateModal = ({ isOpen, onClose, orderData = {}, user }) => {
  const certificateRef = useRef(null);

  if (!isOpen) return null;

  const projectTitle = orderData.listing?.title || "Verified Reforestation & Regional Clean Drive";
  const amountOffeset = orderData.quantity || orderData.totalAmount || 50;
  const transactionRef = orderData.transactionRef || `CT-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date(orderData.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    const printContent = certificateRef.current;
    const printWindow = window.open("about:blank", "_blank", "width=850,height=650");

    printWindow.document.write(`
      <html>
        <head>
          <title>Carbon Offset Certificate - ${transactionRef}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #060a12; color: #f8fafc; margin: 0; padding: 40px; }
            .cert-box { border: 4px solid #10b981; border-radius: 24px; padding: 40px; background: linear-gradient(135deg, #090e1a 0%, #0b1526 100%); text-align: center; box-shadow: 0 0 40px rgba(16,185,129,0.3); }
            .badge { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid #10b981; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 6px 18px; border-radius: 20px; display: inline-block; }
            h1 { font-size: 28px; color: #ffffff; margin: 20px 0 10px 0; letter-spacing: 1px; }
            .user-name { font-size: 32px; font-weight: 900; color: #34d399; margin: 15px 0; text-transform: uppercase; }
            p { font-size: 13px; color: #94a3b8; line-height: 1.6; }
            .amount-box { background: #040810; border: 1px solid #10b981; border-radius: 16px; padding: 16px; margin: 24px 0; }
            .amount-num { font-size: 36px; font-weight: 900; color: #10b981; margin: 0; }
            .details-grid { text-align: left; background: #0a111e; border: 1px solid #1e293b; border-radius: 14px; padding: 16px; margin-bottom: 24px; font-size: 12px; }
            .details-grid p { margin: 6px 0; color: #cbd5e1; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #1e293b; padding-top: 20px; text-align: left; }
            .seal { border: 2px solid #10b981; color: #34d399; width: 75px; height: 75px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; text-align: center; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#080C14] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="text-lg font-black text-white">Verified Carbon Offset Certificate</h3>
              <p className="text-[11px] text-emerald-400 font-semibold">Midnight Obsidian Theme • Official Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Midnight Obsidian Luxury Certificate */}
        <div ref={certificateRef} className="rounded-2xl bg-gradient-to-br from-[#0A111E] via-slate-950 to-[#080C14] border-2 border-emerald-500/40 p-6 sm:p-8 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <span className="inline-block bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Verified UN SDG Compliance Registry
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CERTIFICATE OF CARBON NEUTRALITY
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Proudly Presented To</p>
          <h2 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight">
            {user?.name || "Valued Sustainability Advocate"}
          </h2>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
            In recognition of active environmental stewardship and verified greenhouse gas emission reduction.
          </p>

          <div className="my-4 py-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center shadow-lg">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">{amountOffeset} <span className="text-sm font-semibold text-slate-300">kg CO2e</span></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Total Verified Carbon Offset</p>
          </div>

          <div className="text-left text-xs text-slate-300 space-y-1.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <p><strong className="text-slate-400">Project Initiative:</strong> <span className="text-white font-semibold">{projectTitle}</span></p>
            <p><strong className="text-slate-400">Transaction Reference:</strong> <span className="text-emerald-400 font-mono font-bold">{transactionRef}</span></p>
            <p><strong className="text-slate-400">Date of Issue:</strong> <span className="text-white">{issueDate}</span></p>
            <p><strong className="text-slate-400">Issuing Registry:</strong> <span className="text-teal-400 font-bold">CarbonTrack Global Telemetry Network</span></p>
          </div>

          <div className="pt-4 flex justify-between items-end border-t border-slate-800">
            <div className="text-left">
              <p className="text-xs font-bold text-white">CarbonTrack Platform</p>
              <p className="text-[10px] text-slate-500">Official ESG Certificate • Verified Registry</p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400/50 flex flex-col items-center justify-center text-emerald-400 font-black text-[9px] text-center p-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span>✓ VERIFIED</span>
              <span className="text-[7px] text-emerald-300">SEAL</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20"
          >
            🖨️ Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
