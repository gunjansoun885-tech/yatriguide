"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Compass,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  QrCode as QrIcon,
  Download,
  Eye,
  X,
  Car,
  User,
  Users,
  MapPin,
  Calendar,
  Database,
  Printer,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  ScanLine,
  Landmark,
  ArrowUpDown,
  Phone,
  Mail,
  ShieldAlert,
  HelpCircle,
  Award
} from "lucide-react";
import { toDataURL } from "qrcode";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals State
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [previewQrModal, setPreviewQrModal] = useState(false);
  const [previewQrUrl, setPreviewQrUrl] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // QR Verifier Modal State
  const [qrVerifyModal, setQrVerifyModal] = useState(false);
  const [qrInputCode, setQrInputCode] = useState("");
  const [qrVerifyResult, setQrVerifyResult] = useState(null);
  const [qrVerifyLoading, setQrVerifyLoading] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/registrations?status=${encodeURIComponent(selectedStatus)}&search=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(sortOrder)}`;
      const response = await fetch(url);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setRegistrations(data.registrations || []);
      setDbStatus(data.dbStatus || null);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedStatus, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Status Action: Approve / Reject
  const handleUpdateStatus = async (id, status) => {
    setActionLoading(true);
    setActionMessage({ type: "", text: "" });
    try {
      const response = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Status update failed.");

      setActionMessage({
        type: "success",
        text: `Registration ${id} updated to '${status}'. SMTP notification dispatched.`,
      });
      fetchRegistrations();
    } catch (err) {
      setActionMessage({ type: "error", text: err.message || "Action failed." });
    } finally {
      setActionLoading(false);
    }
  };

  // Open Details View Modal
  const openViewDetails = (reg) => {
    setSelectedRegistration(reg);
    setViewDetailsModal(true);
  };

  // Open Edit Modal
  const openEditModal = (reg) => {
    setSelectedRegistration(reg);
    setEditForm({ ...reg });
    setEditModal(true);
  };

  // Save Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");

      setEditModal(false);
      setActionMessage({ type: "success", text: `Registration ${editForm.id} updated successfully.` });
      fetchRegistrations();
    } catch (err) {
      alert(err.message || "Failed to save changes.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Action
  const handleDeleteRegistration = async () => {
    if (!selectedRegistration?.id) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/registrations?id=${encodeURIComponent(selectedRegistration.id)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");

      setDeleteModal(false);
      setSelectedRegistration(null);
      setActionMessage({ type: "success", text: `Registration deleted successfully.` });
      fetchRegistrations();
    } catch (err) {
      alert(err.message || "Failed to delete registration.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open QR Preview Modal
  const openQrPreview = async (reg) => {
    setSelectedRegistration(reg);
    const passUrl = typeof window !== "undefined" ? `${window.location.origin}/pass?id=${reg.id}` : `/pass?id=${reg.id}`;
    const qr = await toDataURL(passUrl, { errorCorrectionLevel: "M", margin: 2, width: 240 });
    setPreviewQrUrl(qr);
    setPreviewQrModal(true);
  };

  // Verify QR Code / Pass ID Action
  const handleVerifyQr = async (e) => {
    e?.preventDefault();
    if (!qrInputCode.trim()) return;
    setQrVerifyLoading(true);
    setQrVerifyResult(null);
    try {
      const res = await fetch("/api/admin/verify-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: qrInputCode }),
      });
      const data = await res.json();
      setQrVerifyResult(data);
    } catch (err) {
      setQrVerifyResult({ verified: false, status: "ERROR", message: "Failed to connect to verification server." });
    } finally {
      setQrVerifyLoading(false);
    }
  };

  // Export to Excel (CSV format with BOM)
  const handleExportExcel = () => {
    if (registrations.length === 0) {
      alert("No registration records available to export.");
      return;
    }

    const headers = [
      "Pass ID",
      "Status",
      "Vehicle Number",
      "Vehicle Type",
      "Driver/Owner Name",
      "Email",
      "Phone",
      "Travel From",
      "Travel To",
      "Tour From",
      "Tour To",
      "Passenger Count",
      "Emergency Contact",
      "Created At"
    ];

    const csvRows = registrations.map((r) => [
      `"${r.id || ""}"`,
      `"${r.status || "Pending"}"`,
      `"${r.vehicleNumber || ""}"`,
      `"${r.vehicleType || ""}"`,
      `"${(r.ownerName || r.driverName || r.otherName || "").replace(/"/g, '""')}"`,
      `"${r.email || ""}"`,
      `"${r.ownerPhone || r.driverPhone || ""}"`,
      `"${r.travelFrom || ""}"`,
      `"${r.travelTo || ""}"`,
      `"${r.tourFrom || ""}"`,
      `"${r.tourTo || ""}"`,
      `"${r.passengerCount || (r.passengerDetails?.length || 0)}"`,
      `"${r.emergencyContactNo || ""}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YatriGuide_Registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable Government PDF Pass Generator
  const handlePrintPass = async (reg) => {
    const passUrl = typeof window !== "undefined" ? `${window.location.origin}/pass?id=${reg.id}` : `/pass?id=${reg.id}`;
    const qrDataUrl = await toDataURL(passUrl, { errorCorrectionLevel: "H", margin: 1, width: 180 });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const passengerRowsHtml = reg.passengerDetails?.length
      ? reg.passengerDetails
          .map(
            (p, idx) => `
            <tr>
              <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${p.name || "-"}</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${p.age || "-"} yrs</td>
              <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${p.gender || "-"}</td>
            </tr>`
          )
          .join("")
      : `<tr><td colspan="4" style="padding: 8px; text-align: center; color: #64748b;">No extra passenger details attached</td></tr>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Uttarakhand Devbhoomi Travel Pass - ${reg.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 24px; color: #0f172a; background: #fff; line-height: 1.4; }
            .pass-card { max-width: 760px; margin: 0 auto; border: 3px double #c2410c; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #d97706 100%); color: white; padding: 20px 24px; text-align: center; position: relative; }
            .govt-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin: 0; }
            .sub-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; font-weight: 700; margin-top: 4px; }
            .badge-bar { display: flex; justify-content: space-between; items-center; background: #fff7ed; border-bottom: 2px solid #ffedd5; padding: 10px 20px; }
            .pass-id { font-family: monospace; font-size: 15px; font-weight: 800; color: #c2410c; }
            .status-stamp { display: inline-block; padding: 4px 14px; border-radius: 12px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; ${
              reg.status === "Approved"
                ? "background: #dcfce7; color: #15803d; border: 1px solid #86efac;"
                : reg.status === "Rejected"
                ? "background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;"
                : "background: #fef3c7; color: #b45309; border: 1px solid #fde68a;"
            } }
            .body { padding: 24px; }
            .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; tracking-wider; color: #9a3412; border-bottom: 2px solid #ffedd5; pb: 4px; margin-bottom: 12px; margin-top: 16px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            .field-label { font-size: 10px; uppercase; color: #64748b; font-weight: 700; }
            .field-value { font-size: 14px; font-weight: 700; color: #0f172a; }
            .passengers-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
            .passengers-table th { background: #f8fafc; color: #475569; padding: 6px 10px; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
            .qr-container { text-align: center; padding: 16px; background: #fafafa; border-radius: 12px; border: 1px solid #f1f5f9; margin-top: 16px; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 10px; color: #64748b; }
            @media print { body { padding: 0; } .pass-card { border-radius: 0; border: 2px solid #9a3412; } }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <div class="header">
              <h1 class="govt-title">GOVERNMENT OF UTTARAKHAND</h1>
              <div class="sub-title">YatriGuide Safe Tourism Digital Travel Pass</div>
            </div>
            
            <div class="badge-bar">
              <div><span class="field-label">REGISTRATION ID: </span><span class="pass-id">${reg.id}</span></div>
              <div><span class="status-stamp">${(reg.status || "Pending").toUpperCase()}</span></div>
            </div>

            <div class="body">
              <div class="section-title">🚘 Vehicle & Route Authorization</div>
              <div class="grid">
                <div><div class="field-label">Vehicle Registration No.</div><div class="field-value">${reg.vehicleNumber || "-"}</div></div>
                <div><div class="field-label">Category</div><div class="field-value" style="text-transform: capitalize;">${reg.vehicleType || "Private"}</div></div>
                <div><div class="field-label">Authorized Route</div><div class="field-value">${reg.travelFrom || "-"} &rarr; ${reg.travelTo || "-"}</div></div>
                <div><div class="field-label">Travel Window</div><div class="field-value">${reg.tourFrom || "-"} to ${reg.tourTo || "-"}</div></div>
              </div>

              <div class="section-title">👤 Driver & Primary Contact</div>
              <div class="grid">
                <div><div class="field-label">Driver / Owner Name</div><div class="field-value">${reg.ownerName || reg.driverName || reg.otherName || "-"}</div></div>
                <div><div class="field-label">Contact Phone</div><div class="field-value">${reg.ownerPhone || reg.driverPhone || "-"}</div></div>
                <div><div class="field-label">Email Address</div><div class="field-value">${reg.email || "-"}</div></div>
                <div><div class="field-label">Emergency Contact</div><div class="field-value" style="color: #dc2626;">${reg.emergencyContactNo || "-"}</div></div>
              </div>

              <div class="section-title">👥 Authorized Passengers (${reg.passengerDetails?.length || 0})</div>
              <table class="passengers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Passenger Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  ${passengerRowsHtml}
                </tbody>
              </table>

              <div class="qr-container">
                <img src="${qrDataUrl}" alt="Pass QR Code" style="width: 140px; height: 140px;" />
                <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 700; color: #475569;">Scan QR Code at State Checkposts for Real-Time Verification</p>
              </div>
            </div>

            <div class="footer">
              &copy; 2026 Devbhoomi Travel Portal &bull; Verified Digital Security Document &bull; Support: support@yatriguide.in
            </div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Stats Counters
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => !r.status || r.status.toLowerCase() === "pending").length;
  const approvedCount = registrations.filter((r) => r.status && r.status.toLowerCase() === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status && r.status.toLowerCase() === "rejected").length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      {/* Government Navigation Bar */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl shadow-md">
              <Compass className="h-6 w-6 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-black text-white">YatriGuide</span>
                <span className="text-[10px] uppercase tracking-widest bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/30">
                  Control Center
                </span>
              </div>
              <p className="text-[10px] text-stone-400 flex items-center gap-1">
                <Landmark className="h-3 w-3 text-amber-500" /> Uttarakhand Tourist & Pass Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase / File DB Status Pill */}
            {dbStatus && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-800 bg-stone-950">
                <Database className={`h-3.5 w-3.5 ${dbStatus.isSupabaseConfigured ? "text-emerald-400" : "text-amber-400"}`} />
                <span>{dbStatus.isSupabaseConfigured ? "Supabase Connected" : "Local Storage"}</span>
              </div>
            )}

            {/* QR Verification Tool Launcher */}
            <button
              onClick={() => {
                setQrInputCode("");
                setQrVerifyResult(null);
                setQrVerifyModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition"
            >
              <ScanLine className="h-3.5 w-3.5" />
              <span>Verify QR Pass</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Overview Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-stone-800 rounded-xl opacity-60">
              <Users className="h-5 w-5 text-stone-300" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Applications</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalCount}</p>
          </div>

          <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-amber-900/30 rounded-xl">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Pending Review</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{pendingCount}</p>
          </div>

          <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-emerald-900/30 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Approved Passes</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{approvedCount}</p>
          </div>

          <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-rose-900/30 rounded-xl">
              <XCircle className="h-5 w-5 text-rose-400" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Rejected Applications</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-300 mt-1">{rejectedCount}</p>
          </div>
        </div>

        {/* Command Toolbar: Search, Filters, Sorting & Exports */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 w-full lg:w-auto overflow-x-auto">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    selectedStatus === status
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Controls: Search, Sort & Export */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 sm:w-72">
                <div className="flex-1 flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 focus-within:border-orange-500">
                  <Search className="h-4 w-4 text-stone-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search vehicle, owner, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-stone-600"
                  />
                </div>
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition shrink-0"
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 rounded-xl px-2 py-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-stone-300 font-semibold outline-none cursor-pointer"
                >
                  <option value="createdAt" className="bg-stone-900">Date Registered</option>
                  <option value="vehicleNumber" className="bg-stone-900">Vehicle No.</option>
                  <option value="ownerName" className="bg-stone-900">Owner Name</option>
                  <option value="status" className="bg-stone-900">Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1 text-stone-400 hover:text-white"
                  title={`Order: ${sortOrder.toUpperCase()}`}
                >
                  <span className="text-[10px] font-bold uppercase">{sortOrder}</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchRegistrations}
                className="p-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-400 hover:text-white transition"
                title="Refresh Records"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              {/* Export to Excel */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-bold transition"
                title="Export to Excel CSV"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Notification Banner */}
        {actionMessage.text && (
          <div
            className={`rounded-2xl border p-4 text-xs font-semibold flex items-center justify-between ${
              actionMessage.type === "success"
                ? "border-emerald-800 bg-emerald-950/40 text-emerald-300"
                : "border-rose-800 bg-rose-950/40 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage({ type: "", text: "" })} className="p-1 hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Registrations List View Table */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
              Loading registration database...
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-sm">
              No registration records match your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Pass ID / Date</th>
                    <th className="py-3.5 px-4">Vehicle & Category</th>
                    <th className="py-3.5 px-4">Driver / Owner Details</th>
                    <th className="py-3.5 px-4">Route & Travel Window</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-orange-400 font-mono block text-sm">{reg.id}</span>
                        <span className="text-[10px] text-stone-500">
                          {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-white uppercase block text-sm">{reg.vehicleNumber || "-"}</span>
                        <span className="text-[10px] text-stone-400 capitalize">{reg.vehicleType || "private"}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-stone-100 block">
                          {reg.ownerName || reg.driverName || reg.otherName || "-"}
                        </span>
                        <span className="text-[10px] text-stone-400 block">{reg.email || "-"}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{reg.ownerPhone || reg.driverPhone || "-"}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-stone-300 block">
                          {reg.travelFrom || "-"} &rarr; {reg.travelTo || "-"}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {reg.tourFrom || "-"} to {reg.tourTo || "-"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            reg.status === "Approved"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                              : reg.status === "Rejected"
                              ? "bg-rose-950/60 text-rose-300 border-rose-800"
                              : "bg-amber-950/60 text-amber-300 border-amber-800"
                          }`}
                        >
                          {reg.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
                        {/* View Full Details */}
                        <button
                          onClick={() => openViewDetails(reg)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition"
                          title="View Full Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Status Approve */}
                        <button
                          onClick={() => handleUpdateStatus(reg.id, "Approved")}
                          className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-800 hover:text-white transition"
                          title="Approve Pass"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>

                        {/* Status Reject */}
                        <button
                          onClick={() => handleUpdateStatus(reg.id, "Rejected")}
                          className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 hover:bg-rose-800 hover:text-white transition"
                          title="Reject Pass"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>

                        {/* QR Code Preview */}
                        <button
                          onClick={() => openQrPreview(reg)}
                          className="p-1.5 rounded-lg bg-stone-800 text-orange-400 hover:bg-stone-700 transition"
                          title="Preview QR Code"
                        >
                          <QrIcon className="h-4 w-4" />
                        </button>

                        {/* Download / Print PDF Pass */}
                        <button
                          onClick={() => handlePrintPass(reg)}
                          className="p-1.5 rounded-lg bg-stone-800 text-blue-400 hover:bg-stone-700 transition"
                          title="Print / Download PDF Pass"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(reg)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition"
                          title="Edit Registration"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedRegistration(reg);
                            setDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 text-rose-400 hover:bg-rose-900 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* VIEW FULL DETAILS MODAL */}
      {viewDetailsModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl relative my-8 text-stone-200">
            <button
              onClick={() => setViewDetailsModal(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-6">
              <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-2xl border border-orange-500/30">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Full Registration Record</h3>
                <p className="text-xs text-orange-400 font-mono font-semibold">
                  Pass ID: {selectedRegistration.id} &bull; Status: {selectedRegistration.status || "Pending"}
                </p>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Vehicle & Journey Information */}
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-3">
                <h4 className="font-bold text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Vehicle & Route Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-500 block">Vehicle Number</span>
                    <span className="font-bold text-white uppercase text-sm font-mono">{selectedRegistration.vehicleNumber || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Vehicle Type</span>
                    <span className="font-bold text-stone-200 capitalize">{selectedRegistration.vehicleType || "Private"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Driver Type</span>
                    <span className="font-bold text-stone-200 capitalize">{selectedRegistration.driverType || "Owner"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Route</span>
                    <span className="font-bold text-stone-200">{selectedRegistration.travelFrom || "-"} &rarr; {selectedRegistration.travelTo || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Travel Dates</span>
                    <span className="font-bold text-stone-200">{selectedRegistration.tourFrom || "-"} to {selectedRegistration.tourTo || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Stay Duration</span>
                    <span className="font-bold text-stone-200">{selectedRegistration.stayDays || "-"} Days</span>
                  </div>
                </div>
              </div>

              {/* Driver / Owner Details */}
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-3">
                <h4 className="font-bold text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Driver & Owner Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-500 block">Owner / Driver Name</span>
                    <span className="font-bold text-white">{selectedRegistration.ownerName || selectedRegistration.driverName || selectedRegistration.otherName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Contact Phone</span>
                    <span className="font-bold text-stone-200 font-mono">{selectedRegistration.ownerPhone || selectedRegistration.driverPhone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">WhatsApp Phone</span>
                    <span className="font-bold text-stone-200 font-mono">{selectedRegistration.ownerWhatsapp || selectedRegistration.driverWhatsapp || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Email Address</span>
                    <span className="font-bold text-stone-200">{selectedRegistration.email || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Aadhaar Number</span>
                    <span className="font-bold text-stone-200 font-mono">{selectedRegistration.ownerAadhar || selectedRegistration.driverAadhar || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Blood Group</span>
                    <span className="font-bold text-rose-400">{selectedRegistration.ownerBloodGroup || selectedRegistration.driverBloodGroup || selectedRegistration.bloodGroup || "-"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Emergency Contact</span>
                    <span className="font-bold text-rose-400 font-mono">{selectedRegistration.emergencyContactName ? `${selectedRegistration.emergencyContactName} (${selectedRegistration.emergencyContactNo})` : selectedRegistration.emergencyContactNo || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Passengers List */}
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-3">
                <h4 className="font-bold text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" /> Passenger List ({selectedRegistration.passengerDetails?.length || 0})
                </h4>
                {selectedRegistration.passengerDetails && selectedRegistration.passengerDetails.length > 0 ? (
                  <div className="divide-y divide-stone-800">
                    {selectedRegistration.passengerDetails.map((p, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-200">{idx + 1}. {p.name || "-"}</span>
                        <span className="text-stone-400">{p.age} yrs, {p.gender}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-xs">No additional passenger details provided.</p>
                )}
              </div>

              {/* Additional Note */}
              {selectedRegistration.message && (
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1">Additional Note</span>
                  <p className="text-stone-300 italic">{selectedRegistration.message}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end gap-3">
              <button
                onClick={() => setViewDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold hover:bg-stone-700 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewDetailsModal(false);
                  handlePrintPass(selectedRegistration);
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-500 text-xs flex items-center gap-2"
              >
                <Printer className="h-4 w-4" /> Print PDF Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR PREVIEW MODAL */}
      {previewQrModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-900 p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setPreviewQrModal(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Digital Pass QR Code</h3>
            <p className="text-xs text-orange-400 font-mono font-semibold mb-4">{selectedRegistration.id}</p>

            {previewQrUrl && (
              <div className="p-4 bg-white rounded-2xl inline-block mb-4 shadow-lg">
                <Image src={previewQrUrl} alt="Pass QR" width={200} height={200} unoptimized className="mx-auto" />
              </div>
            )}

            <div className="text-xs text-stone-300 space-y-1 text-left bg-stone-950 p-3 rounded-xl border border-stone-800 mb-4 font-sans">
              <p><strong>Vehicle:</strong> {selectedRegistration.vehicleNumber}</p>
              <p><strong>Driver/Owner:</strong> {selectedRegistration.ownerName || selectedRegistration.driverName}</p>
              <p><strong>Status:</strong> <span className="text-emerald-400 font-bold">{selectedRegistration.status || "Pending"}</span></p>
            </div>

            <button
              onClick={() => handlePrintPass(selectedRegistration)}
              className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 text-xs flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" /> Download / Print PDF Pass
            </button>
          </div>
        </div>
      )}

      {/* QR VERIFIER MODAL (Scan & Check Validity) */}
      {qrVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-2xl relative text-stone-100">
            <button
              onClick={() => setQrVerifyModal(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
                <ScanLine className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">QR Code Checkpost Verifier</h3>
                <p className="text-[11px] text-stone-400">Scan or paste Pass ID / QR code to check validity</p>
              </div>
            </div>

            <form onSubmit={handleVerifyQr} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInputCode}
                  onChange={(e) => setQrInputCode(e.target.value)}
                  placeholder="Enter Pass ID e.g. YS-2026-XXXX or QR link"
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  disabled={qrVerifyLoading}
                  className="px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 text-xs shrink-0"
                >
                  {qrVerifyLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>

            {qrVerifyResult && (
              <div
                className={`mt-4 p-4 rounded-2xl border text-xs space-y-2 ${
                  qrVerifyResult.verified
                    ? "border-emerald-800 bg-emerald-950/50 text-emerald-200"
                    : "border-rose-800 bg-rose-950/50 text-rose-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>STATUS: {qrVerifyResult.status}</span>
                  <span>{qrVerifyResult.verified ? "✅ AUTHENTIC" : "⚠️ UNVERIFIED"}</span>
                </div>
                <p>{qrVerifyResult.message}</p>

                {qrVerifyResult.registration && (
                  <div className="pt-2 border-t border-stone-800 space-y-1 text-stone-300 font-mono text-[11px]">
                    <p><strong>ID:</strong> {qrVerifyResult.registration.id}</p>
                    <p><strong>Vehicle:</strong> {qrVerifyResult.registration.vehicleNumber}</p>
                    <p><strong>Driver:</strong> {qrVerifyResult.registration.ownerName || qrVerifyResult.registration.driverName}</p>
                    <p><strong>Route:</strong> {qrVerifyResult.registration.travelFrom} &rarr; {qrVerifyResult.registration.travelTo}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT REGISTRATION MODAL */}
      {editModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setEditModal(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Edit Registration Data</h3>
            <p className="text-xs text-orange-400 font-mono font-semibold mb-4">{selectedRegistration.id}</p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Vehicle Number</label>
                <input
                  type="text"
                  value={editForm.vehicleNumber || ""}
                  onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Vehicle Category</label>
                  <select
                    value={editForm.vehicleType || "private"}
                    onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  >
                    <option value="private">Private</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Approval Status</label>
                  <select
                    value={editForm.status || "Pending"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Travel From</label>
                  <input
                    type="text"
                    value={editForm.travelFrom || ""}
                    onChange={(e) => setEditForm({ ...editForm, travelFrom: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Travel To</label>
                  <input
                    type="text"
                    value={editForm.travelTo || ""}
                    onChange={(e) => setEditForm({ ...editForm, travelTo: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Owner / Driver Name</label>
                  <input
                    type="text"
                    value={editForm.ownerName || editForm.driverName || ""}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value, driverName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 py-2.5 bg-stone-800 text-stone-300 font-bold rounded-xl hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-900 p-6 text-center shadow-2xl">
            <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Delete Registration Record?</h3>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              Are you sure you want to permanently delete registration <span className="font-mono text-orange-400">{selectedRegistration.id}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 py-2.5 bg-stone-800 text-stone-300 font-bold rounded-xl hover:bg-stone-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRegistration}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500 text-xs"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
