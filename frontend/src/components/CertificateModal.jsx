import { useRef } from "react";

const CertificateModal = ({ isOpen, onClose, orderData = {}, user }) => {
  const certificateRef = useRef(null);

  if (!isOpen) return null;

  const totalCO2 = orderData.quantity ?? 0;
  const activityCount = orderData.activityCount ?? 0;
  const topCategory = orderData.topCategory || "General Activities";
  const breakdown = orderData.breakdown || [];
  const transactionRef = orderData.transactionRef || `CT-000000-${new Date().getFullYear()}`;
  const issueDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const userName = user?.name || "Sustainability Advocate";
  const userOrg = user?.organization || "CarbonTrack Platform";

  const hasCO2 = totalCO2 > 0 || activityCount > 0;

  // ── Print / Save PDF ────────────────────────────────────────────────────────
  const handlePrint = () => {
    const printContent = certificateRef.current;
    const printWindow = window.open("about:blank", "_blank", "width=900,height=700");

    const breakdownRows = breakdown
      .map(
        (b) =>
          `<tr><td style="padding:4px 8px;color:#94a3b8;text-transform:capitalize;">${b._id}</td>
           <td style="padding:4px 8px;color:#34d399;font-weight:700;text-align:right;">${b.totalCO2.toFixed(3)} kg</td></tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Carbon Footprint Certificate — ${transactionRef}</title>
          <style>
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', sans-serif; background: #060a12; color: #f8fafc; padding: 40px; }
            .cert { border: 3px solid #10b981; border-radius: 24px; padding: 44px;
                    background: linear-gradient(135deg,#090e1a 0%,#0c1628 100%);
                    box-shadow: 0 0 50px rgba(16,185,129,0.25); text-align: center; }
            .badge { display:inline-block; background:rgba(16,185,129,.15); color:#34d399;
                     border:1px solid #10b981; font-size:10px; font-weight:800;
                     letter-spacing:2px; text-transform:uppercase; padding:5px 16px; border-radius:20px; }
            h1 { font-size:26px; font-weight:900; color:#fff; margin:18px 0 8px; letter-spacing:.5px; }
            .label { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:2px; margin-top:16px; }
            .user-name { font-size:30px; font-weight:900; color:#34d399; margin:8px 0; }
            .amount-box { background:#040810; border:1px solid #10b981; border-radius:16px;
                          padding:18px 24px; margin:20px auto; max-width:340px; }
            .amount-num { font-size:38px; font-weight:900; color:#10b981; }
            .amount-sub { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:2px; margin-top:4px; }
            .info-box { text-align:left; background:#0a111e; border:1px solid #1e293b;
                        border-radius:14px; padding:16px 20px; margin:20px 0; font-size:12px; }
            .info-box p { margin:5px 0; color:#cbd5e1; }
            .info-box strong { color:#94a3b8; }
            table { width:100%; border-collapse:collapse; margin-top:8px; }
            .footer { display:flex; justify-content:space-between; align-items:flex-end;
                      border-top:1px solid #1e293b; padding-top:20px; margin-top:24px; text-align:left; }
            .seal { border:2px solid #10b981; color:#34d399; width:72px; height:72px;
                    border-radius:50%; display:flex; align-items:center; justify-content:center;
                    font-size:9px; font-weight:900; text-align:center; line-height:1.3; }
          </style>
        </head>
        <body>
          <div class="cert">
            <span class="badge">Verified Carbon Footprint Registry • UN SDG Compliant</span>
            <h1>OFFICIAL CARBON FOOTPRINT CERTIFICATE</h1>
            <p class="label">Issued To</p>
            <div class="user-name">${userName}</div>
            <p style="font-size:12px;color:#64748b;margin-bottom:16px;">${userOrg}</p>

            <div class="amount-box">
              <div class="amount-num">${totalCO2} <span style="font-size:18px;color:#94a3b8;">kg CO₂e</span></div>
              <div class="amount-sub">Total Tracked Carbon Footprint</div>
            </div>

            <div class="info-box">
              <p><strong>Total Activities Logged:</strong> ${activityCount}</p>
              <p><strong>Highest Emission Category:</strong> ${topCategory}</p>
              ${breakdown.length > 0 ? `
              <table>
                <tr><th style="text-align:left;padding:4px 8px;color:#64748b;font-size:11px;border-bottom:1px solid #1e293b;">Category</th>
                    <th style="text-align:right;padding:4px 8px;color:#64748b;font-size:11px;border-bottom:1px solid #1e293b;">CO₂ (kg)</th></tr>
                ${breakdownRows}
              </table>` : ""}
              <p style="margin-top:10px;"><strong>Certificate Reference:</strong> <span style="color:#34d399;font-family:monospace;">${transactionRef}</span></p>
              <p><strong>Date of Issue:</strong> ${issueDate}</p>
            </div>

            <div class="footer">
              <div>
                <p style="font-size:13px;font-weight:700;color:#fff;">CarbonTrack Platform</p>
                <p style="font-size:11px;color:#64748b;">Verified ESG Registry • Data-Driven Sustainability</p>
              </div>
              <div class="seal">✓<br/>VERIFIED<br/>SEAL</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  // ── Download as PNG using Canvas ─────────────────────────────────────────────
  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const W = 900, H = 620 + breakdown.length * 26;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#090e1a");
    bg.addColorStop(1, "#0c1628");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // outer border
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    roundRect(ctx, 20, 20, W - 40, H - 40, 24);
    ctx.stroke();

    // glow effect
    ctx.shadowColor = "rgba(16,185,129,0.35)";
    ctx.shadowBlur = 40;
    ctx.strokeStyle = "#10b981";
    roundRect(ctx, 20, 20, W - 40, H - 40, 24);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // badge
    ctx.fillStyle = "rgba(16,185,129,0.15)";
    roundRect(ctx, W / 2 - 200, 50, 400, 28, 14);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    roundRect(ctx, W / 2 - 200, 50, 400, 28, 14);
    ctx.stroke();
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 10px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VERIFIED CARBON FOOTPRINT REGISTRY  •  UN SDG COMPLIANT", W / 2, 69);

    // title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Segoe UI', sans-serif";
    ctx.fillText("OFFICIAL CARBON FOOTPRINT CERTIFICATE", W / 2, 120);

    // issued to
    ctx.fillStyle = "#64748b";
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.fillText("ISSUED TO", W / 2, 155);

    // user name gradient text
    const nameGrad = ctx.createLinearGradient(W / 2 - 150, 0, W / 2 + 150, 0);
    nameGrad.addColorStop(0, "#34d399");
    nameGrad.addColorStop(0.5, "#5eead4");
    nameGrad.addColorStop(1, "#22d3ee");
    ctx.fillStyle = nameGrad;
    ctx.font = "bold 32px 'Segoe UI', sans-serif";
    ctx.fillText(userName.toUpperCase(), W / 2, 195);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px 'Segoe UI', sans-serif";
    ctx.fillText(userOrg, W / 2, 218);

    // amount box
    ctx.fillStyle = "#040810";
    roundRect(ctx, W / 2 - 170, 235, 340, 90, 16);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    roundRect(ctx, W / 2 - 170, 235, 340, 90, 16);
    ctx.stroke();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 40px 'Segoe UI', sans-serif";
    ctx.fillText(`${totalCO2} kg CO₂e`, W / 2, 286);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px 'Segoe UI', sans-serif";
    ctx.fillText("TOTAL TRACKED CARBON FOOTPRINT", W / 2, 312);

    // info box background
    const infoTop = 345;
    const infoH = 80 + breakdown.length * 26 + (breakdown.length > 0 ? 32 : 0);
    ctx.fillStyle = "#0a111e";
    roundRect(ctx, 60, infoTop, W - 120, infoH, 14);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    roundRect(ctx, 60, infoTop, W - 120, infoH, 14);
    ctx.stroke();

    ctx.textAlign = "left";
    const lx = 85;
    let ly = infoTop + 28;
    const row = (label, val, valColor = "#e2e8f0") => {
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'Segoe UI', sans-serif";
      ctx.fillText(label, lx, ly);
      ctx.fillStyle = valColor; ctx.font = "bold 11px 'Segoe UI', sans-serif";
      ctx.fillText(val, lx + 230, ly);
      ly += 22;
    };

    row("Total Activities Logged:", `${activityCount}`);
    row("Highest Emission Category:", topCategory.charAt(0).toUpperCase() + topCategory.slice(1));

    if (breakdown.length > 0) {
      ly += 6;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(lx, ly, W - 120 - 50, 1);
      ly += 14;
      ctx.fillStyle = "#64748b"; ctx.font = "10px 'Segoe UI', sans-serif";
      ctx.fillText("CATEGORY BREAKDOWN", lx, ly); ly += 16;
      breakdown.forEach((b) => {
        ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'Segoe UI', sans-serif";
        ctx.fillText(b._id.charAt(0).toUpperCase() + b._id.slice(1), lx + 10, ly);
        ctx.fillStyle = "#34d399"; ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${b.totalCO2.toFixed(3)} kg`, W - 100, ly);
        ctx.textAlign = "left";
        ly += 22;
      });
      ly += 4;
    }

    row("Certificate Reference:", transactionRef, "#34d399");
    row("Date of Issue:", issueDate);

    // footer line
    const footerY = infoTop + infoH + 24;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerY);
    ctx.lineTo(W - 60, footerY);
    ctx.stroke();

    // footer text
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px 'Segoe UI', sans-serif";
    ctx.fillText("CarbonTrack Platform", 70, footerY + 24);
    ctx.fillStyle = "#64748b"; ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.fillText("Verified ESG Registry  •  Data-Driven Sustainability", 70, footerY + 40);

    // seal circle
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W - 100, footerY + 28, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#34d399"; ctx.font = "bold 9px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ VERIFIED", W - 100, footerY + 25);
    ctx.font = "8px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("SEAL", W - 100, footerY + 38);

    // trigger download
    const link = document.createElement("a");
    link.download = `CarbonTrack-Certificate-${transactionRef}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#080C14] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6">

        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="text-lg font-black text-white">Official Carbon Footprint Certificate</h3>
              <p className="text-[11px] text-emerald-400 font-semibold">Live Data from Your Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold">✕</button>
        </div>

        {/* Live warning if no data */}
        {!hasCO2 && (
          <div className="bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-2xl px-4 py-3">
            ⚠️ No activities logged yet. Log some activities on the dashboard first to generate a real certificate.
          </div>
        )}

        {/* Certificate Preview */}
        <div ref={certificateRef} className="rounded-2xl bg-gradient-to-br from-[#0A111E] via-slate-950 to-[#080C14] border-2 border-emerald-500/40 p-6 sm:p-8 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <span className="inline-block bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Verified Carbon Footprint Registry • UN SDG Compliant
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            OFFICIAL CARBON FOOTPRINT CERTIFICATE
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Issued To</p>
          <h2 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight">
            {userName}
          </h2>
          <p className="text-xs text-slate-500 -mt-2">{userOrg}</p>

          {/* Real CO2 amount */}
          <div className="my-4 py-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center shadow-lg">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">
              {totalCO2} <span className="text-sm font-semibold text-slate-300">kg CO₂e</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Total Tracked Carbon Footprint</p>
          </div>

          {/* Real data details */}
          <div className="text-left text-xs text-slate-300 space-y-1.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <p><strong className="text-slate-400">Total Activities Logged:</strong> <span className="text-white font-semibold">{activityCount}</span></p>
            <p><strong className="text-slate-400">Highest Emission Category:</strong> <span className="text-white font-semibold capitalize">{topCategory}</span></p>
            {breakdown.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Category Breakdown</p>
                {breakdown.map((b) => (
                  <div key={b._id} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{b._id}</span>
                    <span className="text-emerald-400 font-bold">{b.totalCO2.toFixed(3)} kg</span>
                  </div>
                ))}
              </div>
            )}
            <p className="pt-1"><strong className="text-slate-400">Certificate Reference:</strong> <span className="text-emerald-400 font-mono font-bold">{transactionRef}</span></p>
            <p><strong className="text-slate-400">Date of Issue:</strong> <span className="text-white">{issueDate}</span></p>
          </div>

          <div className="pt-4 flex justify-between items-end border-t border-slate-800">
            <div className="text-left">
              <p className="text-xs font-bold text-white">CarbonTrack Platform</p>
              <p className="text-[10px] text-slate-500">Verified ESG Registry • Data-Driven Sustainability</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400/50 flex flex-col items-center justify-center text-emerald-400 font-black text-[9px] text-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span>✓</span>
              <span>VERIFIED</span>
              <span className="text-[7px] text-emerald-300">SEAL</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 flex-wrap">
          <button onClick={onClose} className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition">
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={!hasCO2}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 border border-emerald-500/40 text-emerald-300 font-black text-xs hover:bg-slate-700 hover:scale-[1.02] transition shadow-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬇️ Download PNG
          </button>
          <button
            onClick={handlePrint}
            disabled={!hasCO2}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
