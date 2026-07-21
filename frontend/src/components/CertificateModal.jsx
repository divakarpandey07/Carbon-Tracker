import { useRef } from "react";

const CertificateModal = ({ isOpen, onClose, orderData, user }) => {
  const certificateRef = useRef(null);

  if (!isOpen || !orderData) return null;

  const handlePrint = () => {
    const printContent = certificateRef.current;
    const windowUrl = "about:blank";
    const uniqueName = new Date().getTime();
    const printWindow = window.open(
      windowUrl,
      name,
      `left=50,top=50,width=800,height=600,toolbar=0,scrollbars=1,status=0`
    );

    printWindow.document.write(`
      <html>
        <head>
          <title>Carbon Offset Certificate - ${orderData.transactionRef || "CarbonTrack"}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 40px; }
            .cert-border { border: 12px double #10b981; padding: 40px; border-radius: 20px; text-align: center; position: relative; background: #fafdfb; }
            .badge { background: #10b981; color: #fff; font-size: 12px; font-weight: bold; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
            h1 { font-size: 32px; color: #065f46; margin: 10px 0; }
            h2 { font-size: 24px; color: #0f172a; margin: 20px 0; font-weight: bold; }
            p { font-size: 14px; color: #475569; line-height: 1.6; }
            .highlight { font-size: 28px; font-weight: 900; color: #059669; margin: 15px 0; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: left; }
            .qr-placeholder { width: 80px; height: 80px; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; border-radius: 10px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="text-lg font-black text-white">Carbon Offset Certificate</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Printable Certificate Template */}
        <div ref={certificateRef} className="bg-slate-950 border-8 double border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
            Official Verification Standard
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CERTIFICATE OF CARBON OFFSET
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-widest">Presented to</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-400">{user?.name || "Valued Sustainability Member"}</h2>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            For successfully purchasing and neutralizing environmental impact through certified green offset projects.
          </p>

          <div className="my-4 py-3 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{orderData.quantity || orderData.totalAmount || 50} kg CO2e</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Carbon Offset Amount</p>
          </div>

          <div className="text-left text-xs text-slate-400 space-y-1 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <p><strong className="text-slate-200">Project Title:</strong> {orderData.listing?.title || "Verified Regional Reforestation Initiative"}</p>
            <p><strong className="text-slate-200">Transaction Ref:</strong> {orderData.transactionRef || `CT-${Math.floor(100000 + Math.random() * 900000)}`}</p>
            <p><strong className="text-slate-200">Issue Date:</strong> {new Date(orderData.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>

          <div className="pt-4 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800">
            <div>
              <p className="font-bold text-slate-300">CarbonTrack Platform</p>
              <p>Verified ESG Registry • UN SDG Compliant</p>
            </div>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-[9px] text-center p-1">
              ✓ VERIFIED SEAL
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
