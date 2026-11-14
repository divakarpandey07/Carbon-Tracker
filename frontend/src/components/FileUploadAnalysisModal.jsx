import { useState, useRef } from "react";
import api from "../utils/api";

const FileUploadAnalysisModal = ({ isOpen, onClose, onActivitiesImported }) => {
  const [file, setFile] = useState(null);
  const [saveToDb, setSaveToDb] = useState(true);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setAnalysisResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select or drop a file to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("saveActivities", saveToDb ? "true" : "false");

      const response = await api.post("/upload/analyze-carbon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysisResult(response.data);

      if (saveToDb && onActivitiesImported) {
        onActivitiesImported(response.data.records);
      }
    } catch (err) {
      console.error("Analysis upload error:", err);
      setError(err.response?.data?.message || "Failed to analyze file. Please ensure file format is valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/upload/template", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "carbon_tracker_sample_template.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Template download error:", err);
      setError("Could not download template");
    }
  };

  const handleConfirmImport = async () => {
    if (!analysisResult || !analysisResult.records) return;
    setLoading(true);
    try {
      let importedCount = 0;
      for (const record of analysisResult.records) {
        await api.post("/activities", record);
        importedCount++;
      }
      if (onActivitiesImported) {
        onActivitiesImported(analysisResult.records);
      }
      setAnalysisResult({
        ...analysisResult,
        summary: {
          ...analysisResult.summary,
          savedToDatabase: true,
          savedRecordsCount: importedCount,
        },
      });
    } catch (err) {
      console.error("Import error:", err);
      setError("Error saving some activities to database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0B111E] border border-emerald-500/30 p-6 sm:p-8 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-400/30 flex items-center justify-center text-2xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            📁
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              Automated Telemetry
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              File Upload & Carbon Emission Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload CSV activity sheets, JSON datasets, utility bills, or fuel receipts for instant CO2 equivalent calculation.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Upload Drop Zone & Controls */}
        {!analysisResult && (
          <div className="space-y-5">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/60 rounded-3xl p-8 text-center cursor-pointer bg-slate-950/50 hover:bg-emerald-950/20 transition-all duration-200 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".csv,.json,.txt,.pdf,.png,.jpg,.jpeg,.xlsx"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform mb-3">
                ☁️
              </div>
              <p className="text-sm font-bold text-white">
                {file ? `Selected: ${file.name}` : "Drag and drop your file here, or click to browse"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports CSV, JSON, TXT bills, PDF invoices, and receipts (Max 15 MB)
              </p>
              {file && (
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                  Size: {(file.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>

            {/* Options & Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Save analyzed activities directly to my dashboard
                </span>
              </label>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
                >
                  📄 Sample CSV
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black hover:scale-105 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing Emissions..." : "Analyze File ⚡"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total CO2 Emitted</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {analysisResult.summary.totalCO2} <span className="text-xs">kg</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Records Analyzed</p>
                <p className="text-2xl font-black text-white mt-1">
                  {analysisResult.summary.totalRecords}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Emitter Category</p>
                <p className="text-base font-extrabold text-amber-400 uppercase mt-1">
                  {analysisResult.summary.highestEmitterCategory}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Status</p>
                <p className={`text-xs font-bold mt-2 ${analysisResult.summary.savedToDatabase ? "text-emerald-400" : "text-slate-400"}`}>
                  {analysisResult.summary.savedToDatabase ? "✓ Saved to Dashboard" : "Preview only"}
                </p>
              </div>
            </div>

            {/* Smart Eco Recommendation Alert */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border border-emerald-500/30 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-wide">Analysis Telemetry Insight</p>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {analysisResult.summary.recommendation}
                </p>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Emissions Breakdown by Category</p>
              <div className="space-y-2">
                {Object.values(analysisResult.summary.categoryBreakdown).map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="capitalize font-semibold">{cat.category} ({cat.count} logs)</span>
                      <span className="font-bold text-emerald-400">{cat.totalCO2} kg ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parsed Records Table */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 uppercase">Extracted Activity Records</span>
                <span className="text-[11px] text-slate-400">{analysisResult.records.length} items</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/50 text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Sub-Type</th>
                      <th className="p-2.5">Quantity</th>
                      <th className="p-2.5">CO2 (kg)</th>
                      <th className="p-2.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {analysisResult.records.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2.5 font-semibold capitalize text-emerald-400">{r.category}</td>
                        <td className="p-2.5 capitalize">{r.subType}</td>
                        <td className="p-2.5">{r.quantity} {r.unit}</td>
                        <td className="p-2.5 font-bold text-white">{r.co2Emitted}</td>
                        <td className="p-2.5 text-slate-400 truncate max-w-[200px]">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
              >
                🔄 Upload Another File
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!analysisResult.summary.savedToDatabase && (
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    disabled={loading}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black hover:scale-105 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? "Importing..." : "📥 Save Records to Dashboard"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadAnalysisModal;
