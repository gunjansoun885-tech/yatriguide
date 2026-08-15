"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Compass,
  Search,
  RefreshCw,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  QrCode as QrIcon,
  Eye,
  X,
  Car,
  User,
  Users,
  MapPin,
  Calendar,
  Database,
  Printer,
  AlertTriangle,
  FileSpreadsheet,
  ScanLine,
  Landmark,
  ArrowUpDown,
  BarChart3,
  LayoutDashboard,
  ListChecks,
  TrendingUp,
  ChevronRight,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { toDataURL } from "qrcode";

// ─────────────────────────────────────────────
// Light Blue & White Donut SVG Chart
// ─────────────────────────────────────────────
function DonutChart({ approved, pending, rejected, total }) {
  const size = 120;
  const strokeW = 14;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const approvedPct = total > 0 ? approved / total : 0;
  const pendingPct = total > 0 ? pending / total : 0;
  const rejectedPct = total > 0 ? rejected / total : 0;

  const approvedDash = circ * approvedPct;
  const pendingDash = circ * pendingPct;
  const rejectedDash = circ * rejectedPct;

  const approvedOffset = 0;
  const pendingOffset = -(circ * approvedPct);
  const rejectedOffset = -(circ * (approvedPct + pendingPct));

  return (
    <svg width={size} height={size} className="drop-shadow-md" viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeW}
      />
      {/* Approved - Sky Blue */}
      {approvedPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#0284c7"
          strokeWidth={strokeW}
          strokeDasharray={`${approvedDash} ${circ}`}
          strokeDashoffset={approvedOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      {/* Pending - Amber Light */}
      {pendingPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={strokeW}
          strokeDasharray={`${pendingDash} ${circ}`}
          strokeDashoffset={pendingOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      {/* Rejected - Rose Light */}
      {rejectedPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f43f5e"
          strokeWidth={strokeW}
          strokeDasharray={`${rejectedDash} ${circ}`}
          strokeDashoffset={rejectedOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0f172a"
        fontSize="22"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        {total}
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#64748b"
        fontSize="9"
        fontFamily="sans-serif"
        fontWeight="700"
        letterSpacing="1"
      >
        TOTAL
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Light Blue Mini Sparkline Bar Chart
// ─────────────────────────────────────────────
function MiniBarChart({ data, color = "#0284c7" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${Math.max((v / max) * 100, 8)}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.25 + (i / data.length) * 0.55,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 600;
    const step = Math.ceil(value / (duration / 16)) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─────────────────────────────────────────────
// Light Blue & White Status Badge
// ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  if (s === "approved")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        Approved
      </span>
    );
  if (s === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
        <XCircle className="h-3 w-3 text-rose-600" />
        Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
      <Clock className="h-3 w-3 text-amber-600" />
      Pending
    </span>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Core Data State
  const [registrations, setRegistrations] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // UI State
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal State
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [previewQrModal, setPreviewQrModal] = useState(false);
  const [previewQrUrl, setPreviewQrUrl] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [qrVerifyModal, setQrVerifyModal] = useState(false);
  const [qrInputCode, setQrInputCode] = useState("");
  const [qrVerifyResult, setQrVerifyResult] = useState(null);
  const [qrVerifyLoading, setQrVerifyLoading] = useState(false);

  // Edit & Action State
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchRegistrations = useCallback(async () => {
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
  }, [selectedStatus, searchQuery, sortBy, sortOrder, router]);

  useEffect(() => {
    fetchRegistrations();
  }, [selectedStatus, sortBy, sortOrder, fetchRegistrations]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

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

      const msg = `Pass ${id} → ${status}`;
      setActionMessage({ type: "success", text: `Registration ${id} updated to '${status}'. Notification sent.` });
      setRecentActions((prev) => [
        { id: Date.now(), icon: status === "Approved" ? "✓" : "✕", msg, time: new Date() },
        ...prev.slice(0, 9),
      ]);
      fetchRegistrations();
    } catch (err) {
      setActionMessage({ type: "error", text: err.message || "Action failed." });
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (reg) => {
    setSelectedRegistration(reg);
    setEditForm({ ...reg });
    setEditModal(true);
  };

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
      setActionMessage({ type: "success", text: "Registration deleted successfully." });
      fetchRegistrations();
    } catch (err) {
      alert(err.message || "Failed to delete registration.");
    } finally {
      setActionLoading(false);
    }
  };

  const openQrPreview = async (reg) => {
    setSelectedRegistration(reg);
    const passUrl = `${window.location.origin}/pass?id=${reg.id}`;
    const qr = await toDataURL(passUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
      color: { dark: "#000000", light: "#ffffff" },
    });
    setPreviewQrUrl(qr);
    setPreviewQrModal(true);
  };

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
    } catch {
      setQrVerifyResult({ verified: false, status: "ERROR", message: "Failed to connect to verification server." });
    } finally {
      setQrVerifyLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (registrations.length === 0) return alert("No records available to export.");
    const headers = [
      "Pass ID",
      "Status",
      "Vehicle Number",
      "Vehicle Type",
      "Driver/Owner Name",
      "Email",
      "Phone",
      "Registration Password",
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
      `"${r.registrationPassword || r.userPassword || r.rawPassword || ""}"`,
      `"${r.travelFrom || ""}"`,
      `"${r.travelTo || ""}"`,
      `"${r.tourFrom || ""}"`,
      `"${r.tourTo || ""}"`,
      `"${r.passengerCount || (r.passengerDetails?.length || 0)}"`,
      `"${r.emergencyContactNo || ""}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}"`,
    ]);
    const csv = "\uFEFF" + [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `YatriGuide_Registrations_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintPass = async (reg) => {
    const passUrl = `${window.location.origin}/pass?id=${reg.id}`;
    const qrDataUrl = await toDataURL(passUrl, { errorCorrectionLevel: "H", margin: 1, width: 180 });
    const passengerRowsHtml = reg.passengerDetails?.length
      ? reg.passengerDetails.map((p, i) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;text-align:center">${i+1}</td><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;font-weight:600">${p.name||"-"}</td><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;text-align:center">${p.age||"-"} yrs</td><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;text-align:center">${p.gender||"-"}</td></tr>`).join("")
      : `<tr><td colspan="4" style="padding:8px;text-align:center;color:#64748b">No extra passenger details attached</td></tr>`;
    const pw = window.open("", "_blank");
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head><title>Yatriguide Travel Pass - ${reg.id}</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');body{font-family:'Inter',sans-serif;padding:24px;color:#0f172a;background:#fff}.pass-card{max-width:760px;margin:0 auto;border:2px solid #0284c7;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(2,132,199,0.1)}.header{background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;padding:20px 24px;text-align:center}.govt-title{font-size:20px;font-weight:800;text-transform:uppercase;margin:0;letter-spacing:1px}.sub-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:.9;font-weight:700;margin-top:4px}.badge-bar{display:flex;justify-content:space-between;background:#f0f9ff;border-bottom:1px solid #e0f2fe;padding:10px 20px}.pass-id{font-family:monospace;font-size:15px;font-weight:800;color:#0369a1}.status-stamp{display:inline-block;padding:4px 14px;border-radius:6px;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:1px;background:#0284c7;color:#fff}.body{padding:24px}.section-title{font-size:12px;font-weight:800;text-transform:uppercase;color:#0369a1;border-bottom:2px solid #0284c7;padding-bottom:4px;margin-bottom:12px;margin-top:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field-label{font-size:10px;text-transform:uppercase;color:#64748b;font-weight:700}.field-value{font-size:14px;font-weight:700;color:#0f172a}.passengers-table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}.passengers-table th{background:#f0f9ff;color:#0369a1;padding:6px 10px;font-size:10px;text-transform:uppercase;border-bottom:2px solid #0284c7}.qr-container{text-align:center;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-top:16px}.footer{background:#f0f9ff;border-top:1px solid #e0f2fe;padding:14px;text-align:center;font-size:10px;color:#64748b}@media print{body{padding:0}.pass-card{border-radius:0;border:2px solid #0284c7}}</style></head><body><div class="pass-card"><div class="header"><h1 class="govt-title">GOVERNMENT OF UTTARAKHAND</h1><div class="sub-title">YatriGuide Safe Tourism Digital Travel Pass</div></div><div class="badge-bar"><div><span class="field-label">REGISTRATION ID: </span><span class="pass-id">${reg.id}</span></div><div><span class="status-stamp">${(reg.status||"Pending").toUpperCase()}</span></div></div><div class="body"><div class="section-title">🚘 Vehicle & Route Authorization</div><div class="grid"><div><div class="field-label">Vehicle Registration No.</div><div class="field-value">${reg.vehicleNumber||"-"}</div></div><div><div class="field-label">Category</div><div class="field-value" style="text-transform:capitalize">${reg.vehicleType||"Private"}</div></div><div><div class="field-label">Authorized Route</div><div class="field-value">${reg.travelFrom||"-"} → ${reg.travelTo||"-"}</div></div><div><div class="field-label">Travel Window</div><div class="field-value">${reg.tourFrom||"-"} to ${reg.tourTo||"-"}</div></div></div><div class="section-title">👤 Driver & Primary Contact</div><div class="grid"><div><div class="field-label">Driver / Owner Name</div><div class="field-value">${reg.ownerName||reg.driverName||reg.otherName||"-"}</div></div><div><div class="field-label">Contact Phone</div><div class="field-value">${reg.ownerPhone||reg.driverPhone||"-"}</div></div><div><div class="field-label">Email Address</div><div class="field-value">${reg.email||"-"}</div></div><div><div class="field-label">Emergency Contact</div><div class="field-value">${reg.emergencyContactNo||"-"}</div></div></div><div class="section-title">👥 Authorized Passengers (${reg.passengerDetails?.length||0})</div><table class="passengers-table"><thead><tr><th>#</th><th>Passenger Name</th><th>Age</th><th>Gender</th></tr></thead><tbody>${passengerRowsHtml}</tbody></table><div class="qr-container"><img src="${qrDataUrl}" alt="QR" style="width:140px;height:140px"><p style="margin:6px 0 0;font-size:11px;font-weight:700;color:#0284c7">Scan QR Code at State Checkposts for Real-Time Verification</p></div></div><div class="footer">© 2026 Devbhoomi Travel Portal • Verified Digital Security Document • support@yatriguide.in</div></div><script>window.onload=function(){window.print()}<\/script></body></html>`);
    pw.document.close();
  };

  const allRegs = registrations;
  const totalCount = allRegs.length;
  const pendingCount = allRegs.filter((r) => !r.status || r.status.toLowerCase() === "pending").length;
  const approvedCount = allRegs.filter((r) => r.status?.toLowerCase() === "approved").length;
  const rejectedCount = allRegs.filter((r) => r.status?.toLowerCase() === "rejected").length;
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const privateCount = allRegs.filter((r) => !r.vehicleType || r.vehicleType === "private").length;
  const commercialCount = allRegs.filter((r) => r.vehicleType === "commercial").length;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return allRegs.filter((r) => {
      const t = new Date(r.createdAt || 0).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
  });

  const destMap = {};
  allRegs.forEach((r) => {
    const d = r.travelTo || "Unknown";
    destMap[d] = (destMap[d] || 0) + 1;
  });
  const topDests = Object.entries(destMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "registrations", icon: ListChecks, label: "Registrations" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div
      className="min-h-screen flex bg-slate-50 text-slate-800 font-sans"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)",
        color: "#1e293b",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ════════════════════════════════════════
          SIDEBAR (MIDNIGHT NAVY & SKY BLUE)
      ════════════════════════════════════════ */}
      <aside
        style={{
          width: sidebarOpen ? "240px" : "68px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          borderRight: "1px solid #334155",
          transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 25px rgba(2,132,199,0.08)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minHeight: "68px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0284c7, #0369a1)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(2,132,199,0.35)",
            }}
          >
            <Compass size={22} color="#ffffff" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.3px" }}>
                YatriGuide
              </div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#38bdf8",
                  marginTop: "1px",
                }}
              >
                Control Center
              </div>
            </div>
          )}
        </div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          style={{
            position: "absolute",
            top: "22px",
            right: sidebarOpen ? "12px" : "16px",
            background: "#334155",
            border: "1px solid #475569",
            borderRadius: "6px",
            padding: "4px",
            cursor: "pointer",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s",
          }}
        >
          <ChevronRight
            size={14}
            style={{ transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
          />
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map(({ id, icon: Icon, label }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: sidebarOpen ? "10px 14px" : "10px",
                  borderRadius: "10px",
                  background: active ? "linear-gradient(135deg, #0284c7, #0369a1)" : "transparent",
                  border: active ? "1px solid #38bdf8" : "1px solid transparent",
                  color: active ? "#ffffff" : "#94a3b8",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontWeight: active ? "800" : "600",
                  fontSize: "13px",
                  boxShadow: active ? "0 4px 14px rgba(2,132,199,0.3)" : "none",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                }}
              >
                <Icon size={18} color={active ? "#ffffff" : "#94a3b8"} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}

          <div style={{ borderTop: "1px solid #334155", margin: "10px 4px" }} />

          {/* QR Verify Button */}
          <button
            onClick={() => { setQrInputCode(""); setQrVerifyResult(null); setQrVerifyModal(true); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: sidebarOpen ? "10px 14px" : "10px",
              borderRadius: "10px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
              fontWeight: "700",
              fontSize: "13px",
              justifyContent: sidebarOpen ? "flex-start" : "center",
            }}
          >
            <ScanLine size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Verify QR Pass</span>}
          </button>
        </nav>

        {/* Database Status & Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #334155" }}>
          {sidebarOpen && dbStatus && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "8px",
                background: "#1e293b",
                border: "1px solid #334155",
                marginBottom: "8px",
                fontSize: "11px",
                color: "#e2e8f0",
                fontWeight: "600",
              }}
            >
              <Database size={13} color="#38bdf8" />
              <span>{dbStatus.isSupabaseConfigured ? "Supabase Live" : "Local Storage"}</span>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  marginLeft: "auto",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: sidebarOpen ? "9px 12px" : "9px",
              borderRadius: "8px",
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f87171",
              cursor: "pointer",
              width: "100%",
              fontSize: "13px",
              fontWeight: "700",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              transition: "all 0.2s",
            }}
          >
            <LogOut size={16} color="#f87171" style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT AREA (LIGHT BLUE & WHITE)
      ════════════════════════════════════════ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top Header Bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "#ffffff",
            borderBottom: "1px solid #e0f2fe",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            boxShadow: "0 4px 20px rgba(2,132,199,0.04)",
          }}
        >
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>
              {activeView === "dashboard" && "Dashboard Overview"}
              {activeView === "registrations" && "Registration Management"}
              {activeView === "analytics" && "Analytics & Reports"}
            </h1>
            <p style={{ fontSize: "11px", color: "#0284c7", margin: 0, marginTop: "1px", fontWeight: "600" }}>
              Uttarakhand Tourist Pass Administration Portal
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#0369a1",
                fontWeight: "700",
                fontFamily: "monospace",
                background: "#f0f9ff",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid #bae6fd",
              }}
            >
              {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
            </div>

            <button
              onClick={fetchRegistrations}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                color: "#0284c7",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: "700",
              }}
              title="Refresh Data"
            >
              <RefreshCw size={15} color="#0284c7" style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportExcel}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "800",
                boxShadow: "0 4px 12px rgba(2,132,199,0.25)",
              }}
            >
              <FileSpreadsheet size={15} color="#ffffff" />
              Export CSV
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        {actionMessage.text && (
          <div
            style={{
              margin: "16px 24px 0",
              padding: "12px 16px",
              borderRadius: "10px",
              background: actionMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${actionMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              color: actionMessage.type === "success" ? "#166534" : "#991b1b",
              fontSize: "12px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {actionMessage.type === "success" ? <CheckCircle2 size={16} color="#166534" /> : <AlertTriangle size={16} color="#991b1b" />}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage({ type: "", text: "" })}
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.7 }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            VIEW: DASHBOARD OVERVIEW
        ═══════════════════════════════════════ */}
        {activeView === "dashboard" && (
          <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* KPI Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Total Applications", value: totalCount, icon: Users, color: "#0284c7", bar: last7 },
                { label: "Pending Review", value: pendingCount, icon: Clock, color: "#d97706", bar: last7.map((v, i) => Math.floor(v * 0.4 + i * 0.2)) },
                { label: "Approved Passes", value: approvedCount, icon: CheckCircle2, color: "#16a34a", bar: last7.map((v) => Math.floor(v * 0.6)) },
                { label: "Rejected Applications", value: rejectedCount, icon: XCircle, color: "#dc2626", bar: last7.map((v) => Math.floor(v * 0.15)) },
              ].map(({ label, value, icon: Icon, color, bar }) => (
                <div
                  key={label}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e0f2fe",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0", lineHeight: 1 }}>
                        <AnimatedNumber value={value} />
                      </p>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "10px", background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                      <Icon size={22} color={color} />
                    </div>
                  </div>
                  <MiniBarChart data={bar} color={color} />
                </div>
              ))}
            </div>

            {/* Donut + Recent + Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 280px", gap: "16px" }}>
              {/* Donut Chart Panel */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <div style={{ width: "100%", marginBottom: "4px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Pass Distribution</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0" }}>Approval breakdown</p>
                </div>
                <DonutChart
                  approved={approvedCount}
                  pending={pendingCount}
                  rejected={rejectedCount}
                  total={totalCount}
                />
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "Approved", count: approvedCount, color: "#0284c7" },
                    { label: "Pending", count: pendingCount, color: "#f59e0b" },
                    { label: "Rejected", count: rejectedCount, color: "#f43f5e" },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
                        <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>{label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: "800" }}>{count}</span>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                          {totalCount > 0 ? `${Math.round((count / totalCount) * 100)}%` : "0%"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#0369a1", fontWeight: "700" }}>Approval Rate</span>
                    <span style={{ fontSize: "14px", color: "#0369a1", fontWeight: "900" }}>{approvalRate}%</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "6px", background: "#e0f2fe", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "6px",
                        background: "linear-gradient(90deg, #0284c7, #0369a1)",
                        width: `${approvalRate}%`,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f0f9ff/50",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Recent Registrations</p>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0" }}>Latest 5 entries</p>
                  </div>
                  <button
                    onClick={() => setActiveView("registrations")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#0284c7",
                      fontWeight: "800",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>
                {loading ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    <div style={{ width: "24px", height: "24px", border: "2px solid #0284c7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                    Loading...
                  </div>
                ) : registrations.slice(0, 5).length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>No registrations found.</div>
                ) : (
                  <div style={{ overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #e0f2fe", background: "#f0f9ff" }}>
                          {["Pass ID", "Vehicle", "Owner", "Route", "Status"].map((h) => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#0369a1", fontWeight: "800", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.slice(0, 5).map((reg) => (
                          <tr
                            key={reg.id}
                            style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.15s" }}
                            onClick={() => { setSelectedRegistration(reg); setViewDetailsModal(true); }}
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ color: "#0284c7", fontFamily: "monospace", fontWeight: "800", fontSize: "11px" }}>{reg.id}</span>
                              <br />
                              <span style={{ color: "#94a3b8", fontSize: "10px" }}>
                                {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "-"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ color: "#0f172a", fontWeight: "800", textTransform: "uppercase" }}>{reg.vehicleNumber || "-"}</span>
                              <br />
                              <span style={{ color: "#64748b", fontSize: "10px", textTransform: "capitalize" }}>{reg.vehicleType || "Private"}</span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#334155", fontWeight: "600" }}>{reg.ownerName || reg.driverName || "-"}</td>
                            <td style={{ padding: "12px 16px", color: "#475569" }}>
                              {reg.travelFrom || "?"} → {reg.travelTo || "?"}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <StatusBadge status={reg.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>Quick Actions</p>
                {[
                  { icon: ScanLine, label: "Verify QR Pass", action: () => { setQrInputCode(""); setQrVerifyResult(null); setQrVerifyModal(true); } },
                  { icon: FileSpreadsheet, label: "Export to Excel", action: handleExportExcel },
                  { icon: ListChecks, label: "Manage Passes", action: () => setActiveView("registrations") },
                  { icon: BarChart3, label: "View Analytics", action: () => setActiveView("analytics") },
                  { icon: RefreshCw, label: "Sync Database", action: fetchRegistrations },
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      color: "#0369a1",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "700",
                      width: "100%",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={16} color="#0284c7" />
                    {label}
                  </button>
                ))}

                {recentActions.length > 0 && (
                  <div style={{ marginTop: "8px", borderTop: "1px solid #e0f2fe", paddingTop: "12px" }}>
                    <p style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                      Recent Activity
                    </p>
                    {recentActions.slice(0, 3).map((a) => (
                      <div key={a.id} style={{ display: "flex", gap: "6px", marginBottom: "6px", fontSize: "11px", color: "#475569" }}>
                        <span>{a.icon}</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Destinations */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Top Destinations</p>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 16px" }}>Most visited locations</p>
                {topDests.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontSize: "12px" }}>No destination data available.</p>
                ) : (
                  topDests.map(([dest, count], i) => {
                    const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                    return (
                      <div key={dest} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: "800" }}>#{i + 1}</span>
                            <span style={{ fontSize: "12px", color: "#1e293b", fontWeight: "700" }}>{dest}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>{count}</span>
                        </div>
                        <div style={{ height: "5px", borderRadius: "5px", background: "#e0f2fe" }}>
                          <div
                            style={{
                              height: "100%",
                              borderRadius: "5px",
                              background: "linear-gradient(90deg, #0284c7, #0369a1)",
                              width: `${pct}%`,
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Vehicle Categories */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Vehicle Categories</p>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 20px" }}>Private vs Commercial breakdown</p>

                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                  {[
                    { label: "Private", count: privateCount, icon: Car },
                    { label: "Commercial", count: commercialCount, icon: Landmark },
                  ].map(({ label, count, icon: Icon }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "14px",
                          background: "#f0f9ff",
                          border: "1px solid #bae6fd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 8px",
                          boxShadow: "0 4px 12px rgba(2,132,199,0.1)",
                        }}
                      >
                        <Icon size={24} color="#0284c7" />
                      </div>
                      <p style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
                        <AnimatedNumber value={count} />
                      </p>
                      <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", margin: "2px 0 0" }}>{label}</p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    fontSize: "11px",
                  }}
                >
                  {[
                    { label: "Today's Date", value: new Date().toLocaleDateString("en-IN") },
                    { label: "Portal Status", value: "Active Live" },
                    { label: "Admin Role", value: "Super Admin" },
                    { label: "Auth Method", value: "HMAC-SHA256" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: "#64748b", margin: 0, fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "9px" }}>{label}</p>
                      <p style={{ color: "#0369a1", margin: "2px 0 0", fontWeight: "700" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════════
            VIEW: REGISTRATIONS TABLE
        ═══════════════════════════════════════ */}
        {activeView === "registrations" && (
          <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Filter Toolbar */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e0f2fe",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  background: "#f0f9ff",
                  padding: "4px",
                  borderRadius: "10px",
                  border: "1px solid #bae6fd",
                }}
              >
                {["All", "Pending", "Approved", "Rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "800",
                      cursor: "pointer",
                      border: "none",
                      transition: "all 0.2s",
                      background: selectedStatus === s ? "#0284c7" : "transparent",
                      color: selectedStatus === s ? "#ffffff" : "#0369a1",
                      boxShadow: selectedStatus === s ? "0 2px 8px rgba(2,132,199,0.3)" : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Search size={14} color="#64748b" />
                    <input
                      type="text"
                      placeholder="Search vehicle, owner, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: "#000000",
                        fontSize: "12px",
                        width: "200px",
                        fontWeight: "600",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 18px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #0284c7, #0369a1)",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "800",
                      boxShadow: "0 2px 8px rgba(2,132,199,0.25)",
                    }}
                  >
                    Search
                  </button>
                </form>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <ArrowUpDown size={13} color="#64748b" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: "12px", fontWeight: "700", outline: "none", cursor: "pointer" }}
                  >
                    <option value="createdAt">Date</option>
                    <option value="vehicleNumber">Vehicle No.</option>
                    <option value="ownerName">Owner</option>
                    <option value="status">Status</option>
                  </select>
                  <button
                    onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0284c7",
                      fontSize: "10px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    {sortOrder}
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e0f2fe",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
              }}
            >
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
                  <div style={{ width: "32px", height: "32px", border: "2px solid #0284c7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "13px", fontWeight: "600" }}>Loading registration database...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
                  <ClipboardList size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "13px", fontWeight: "600" }}>No registrations match your filter criteria.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e0f2fe", background: "#f0f9ff" }}>
                        {["Pass ID / Date", "Vehicle & Category", "Driver / Owner", "Route & Window", "Status", "Actions"].map((h, i) => (
                          <th
                            key={h}
                            style={{
                              padding: "13px 16px",
                              textAlign: i === 5 ? "right" : "left",
                              color: "#0369a1",
                              fontWeight: "800",
                              fontSize: "10px",
                              textTransform: "uppercase",
                              letterSpacing: "0.8px",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr
                          key={reg.id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            transition: "background 0.15s",
                          }}
                        >
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#0284c7", fontFamily: "monospace", fontWeight: "800", display: "block" }}>{reg.id}</span>
                            <span style={{ color: "#94a3b8", fontSize: "10px" }}>
                              {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString("en-IN") : "-"}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#0f172a", fontWeight: "800", textTransform: "uppercase", display: "block" }}>{reg.vehicleNumber || "-"}</span>
                            <span style={{ color: "#64748b", fontSize: "10px", textTransform: "capitalize" }}>{reg.vehicleType || "Private"}</span>
                          </td>
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#0f172a", fontWeight: "700", display: "block" }}>{reg.ownerName || reg.driverName || reg.otherName || "-"}</span>
                            <span style={{ color: "#64748b", fontSize: "10px", display: "block" }}>{reg.email || "-"}</span>
                            <span style={{ color: "#94a3b8", fontSize: "10px", fontFamily: "monospace", display: "block" }}>{reg.ownerPhone || reg.driverPhone || "-"}</span>
                            {(reg.registrationPassword || reg.userPassword || reg.rawPassword) && (
                              <span style={{ color: "#0369a1", fontSize: "10px", fontWeight: "800", fontFamily: "monospace", background: "#e0f2fe", padding: "1px 6px", borderRadius: "4px", display: "inline-block", marginTop: "3px", border: "1px solid #bae6fd" }}>
                                🔑 {reg.registrationPassword || reg.userPassword || reg.rawPassword}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#334155", fontWeight: "700", display: "block" }}>
                              {reg.travelFrom || "-"} → {reg.travelTo || "-"}
                            </span>
                            <span style={{ color: "#64748b", fontSize: "10px" }}>
                              {reg.tourFrom || "-"} to {reg.tourTo || "-"}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <StatusBadge status={reg.status} />
                          </td>
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                              {[
                                { icon: Eye, title: "View Details", action: () => { setSelectedRegistration(reg); setViewDetailsModal(true); } },
                                { icon: CheckCircle2, title: "Approve Pass", action: () => handleUpdateStatus(reg.id, "Approved") },
                                { icon: XCircle, title: "Reject Pass", action: () => handleUpdateStatus(reg.id, "Rejected") },
                                { icon: QrIcon, title: "QR Code", action: () => openQrPreview(reg) },
                                { icon: Printer, title: "Print Pass", action: () => handlePrintPass(reg) },
                                { icon: Edit3, title: "Edit Record", action: () => openEditModal(reg) },
                                { icon: Trash2, title: "Delete Record", action: () => { setSelectedRegistration(reg); setDeleteModal(true); } },
                              ].map(({ icon: Icon, title, action }) => (
                                <button
                                  key={title}
                                  onClick={action}
                                  title={title}
                                  style={{
                                    padding: "6px",
                                    borderRadius: "8px",
                                    background: "#f0f9ff",
                                    border: "1px solid #bae6fd",
                                    color: "#0284c7",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  <Icon size={14} color="#0284c7" />
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #e0f2fe", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                      Showing {registrations.length} record{registrations.length !== 1 ? "s" : ""}
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                      Filter: <strong style={{ color: "#0284c7" }}>{selectedStatus}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════════
            VIEW: ANALYTICS
        ═══════════════════════════════════════ */}
        {activeView === "analytics" && (
          <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Overall Approval Rate", value: `${approvalRate}%`, icon: TrendingUp, sub: `${approvedCount} of ${totalCount} approved` },
                { label: "Total Passenger Count", value: allRegs.reduce((sum, r) => sum + (r.passengerDetails?.length || 0) + 1, 0), icon: Users, sub: "Primary + extra passengers" },
                { label: "Avg Stay Duration", value: (() => {
                  const vals = allRegs.map((r) => parseInt(r.stayDays || "0")).filter((v) => v > 0);
                  return vals.length ? `${Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)} Days` : "N/A";
                })(), icon: Calendar, sub: "Across all registrations" },
              ].map(({ label, value, icon: Icon, sub }) => (
                <div
                  key={label}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e0f2fe",
                    borderRadius: "14px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color="#0284c7" />
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: "2px 0 2px", lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: "11px", color: "#0284c7", margin: 0, fontWeight: "600" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Registrations */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e0f2fe",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Daily Registrations — Last 7 Days</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0" }}>New applications per day</p>
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    fontSize: "11px",
                    color: "#0369a1",
                    fontWeight: "800",
                  }}
                >
                  Total: {last7.reduce((a, b) => a + b, 0)} this week
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
                {last7.map((v, i) => {
                  const max = Math.max(...last7, 1);
                  const h = Math.max((v / max) * 100, 4);
                  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dayName = days[d.getDay()];
                  const isToday = i === 6;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                      <span style={{ fontSize: "11px", color: "#0f172a", fontWeight: "800" }}>{v > 0 ? v : ""}</span>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div
                          style={{
                            width: "100%",
                            height: `${h}%`,
                            borderRadius: "6px 6px 0 0",
                            background: isToday ? "linear-gradient(180deg, #0284c7, #0369a1)" : "#bae6fd",
                            transition: "height 0.5s ease",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "10px", color: isToday ? "#0284c7" : "#64748b", fontWeight: isToday ? "800" : "600" }}>
                        {dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e0f2fe" }}>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Top Destinations</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e0f2fe", background: "#f0f9ff" }}>
                      {["Destination", "Applications", "Share"].map((h) => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#0369a1", fontWeight: "800", fontSize: "10px", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topDests.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No destination data available.</td></tr>
                    ) : topDests.map(([dest, count]) => (
                      <tr key={dest} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <MapPin size={14} color="#0284c7" />
                            <span style={{ color: "#0f172a", fontWeight: "700" }}>{dest}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", color: "#0284c7", fontWeight: "800" }}>{count}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ flex: 1, height: "5px", borderRadius: "5px", background: "#e0f2fe", overflow: "hidden" }}>
                              <div style={{ width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%`, height: "100%", background: "#0284c7", borderRadius: "5px" }} />
                            </div>
                            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "800", minWidth: "30px" }}>
                              {totalCount > 0 ? `${Math.round((count / totalCount) * 100)}%` : "0%"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0f2fe",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "0 4px 16px rgba(2,132,199,0.04)",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px" }}>Status Distribution</p>
                  {[
                    { label: "Approved", count: approvedCount, color: "#0284c7" },
                    { label: "Pending", count: pendingCount, color: "#f59e0b" },
                    { label: "Rejected", count: rejectedCount, color: "#f43f5e" },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "11px", color: "#475569", fontWeight: "700", width: "60px", flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: "8px", borderRadius: "8px", background: "#f0f9ff", overflow: "hidden", border: "1px solid #bae6fd" }}>
                        <div
                          style={{
                            width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%`,
                            height: "100%",
                            background: color,
                            borderRadius: "8px",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: "900", width: "36px", textAlign: "right" }}>{count}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #e0f2fe", paddingTop: "16px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px" }}>Vehicle Type</p>
                  {[
                    { label: "Private", count: privateCount, color: "#0284c7" },
                    { label: "Commercial", count: commercialCount, color: "#0369a1" },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "11px", color: "#475569", fontWeight: "700", width: "70px", flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: "8px", borderRadius: "8px", background: "#f0f9ff", overflow: "hidden", border: "1px solid #bae6fd" }}>
                        <div
                          style={{
                            width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%`,
                            height: "100%",
                            background: color,
                            borderRadius: "8px",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: "900", width: "36px", textAlign: "right" }}>{count}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleExportExcel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #0284c7, #0369a1)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "800",
                    marginTop: "auto",
                    boxShadow: "0 4px 12px rgba(2,132,199,0.25)",
                  }}
                >
                  <FileSpreadsheet size={15} color="#ffffff" />
                  Download Analytics Report (CSV)
                </button>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* ════════════════════════════════════════
          MODAL: VIEW FULL DETAILS (LIGHT BLUE & WHITE)
      ════════════════════════════════════════ */}
      {viewDetailsModal && selectedRegistration && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              background: "#ffffff",
              border: "1px solid #e0f2fe",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 25px 80px rgba(2,132,199,0.15)",
              position: "relative",
              margin: "auto",
            }}
          >
            <button
              onClick={() => setViewDetailsModal(false)}
              style={{ position: "absolute", right: "20px", top: "20px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#0284c7" }}
            >
              <X size={16} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e0f2fe" }}>
              <div style={{ padding: "12px", background: "linear-gradient(135deg, #0284c7, #0369a1)", borderRadius: "14px", boxShadow: "0 4px 12px rgba(2,132,199,0.3)" }}>
                <Car size={22} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Full Registration Record</h3>
                <p style={{ fontSize: "12px", color: "#0284c7", fontFamily: "monospace", fontWeight: "800", margin: "3px 0 0" }}>
                  {selectedRegistration.id} &bull; <StatusBadge status={selectedRegistration.status} />
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", maxHeight: "60vh", overflowY: "auto" }}>
              {[
                {
                  title: "Vehicle & Route Details",
                  icon: MapPin,
                  fields: [
                    { label: "Vehicle Number", value: selectedRegistration.vehicleNumber },
                    { label: "Vehicle Type", value: selectedRegistration.vehicleType },
                    { label: "Driver Type", value: selectedRegistration.driverType },
                    { label: "Route", value: `${selectedRegistration.travelFrom || "-"} → ${selectedRegistration.travelTo || "-"}` },
                    { label: "Travel Dates", value: `${selectedRegistration.tourFrom || "-"} to ${selectedRegistration.tourTo || "-"}` },
                    { label: "Stay Duration", value: `${selectedRegistration.stayDays || "-"} Days` },
                  ],
                },
                {
                  title: "Driver & Owner Details",
                  icon: User,
                  fields: [
                    { label: "Owner / Driver Name", value: selectedRegistration.ownerName || selectedRegistration.driverName || selectedRegistration.otherName },
                    { label: "Contact Phone", value: selectedRegistration.ownerPhone || selectedRegistration.driverPhone },
                    { label: "WhatsApp", value: selectedRegistration.ownerWhatsapp || selectedRegistration.driverWhatsapp },
                    { label: "Email Address", value: selectedRegistration.email },
                    { label: "Registration Password", value: selectedRegistration.registrationPassword || selectedRegistration.userPassword || selectedRegistration.rawPassword },
                    { label: "Aadhaar Number", value: selectedRegistration.ownerAadhar || selectedRegistration.driverAadhar },
                    { label: "Blood Group", value: selectedRegistration.ownerBloodGroup || selectedRegistration.driverBloodGroup || selectedRegistration.bloodGroup },
                    { label: "Emergency Contact", value: selectedRegistration.emergencyContactNo },
                  ],
                },
              ].map(({ title, icon: Icon, fields }) => (
                <div
                  key={title}
                  style={{
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <h4 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#0369a1", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon size={14} color="#0284c7" /> {title}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                    {fields.map(({ label, value }) => (
                      <div key={label}>
                        <span style={{ fontSize: "10px", color: "#64748b", display: "block", fontWeight: "700", textTransform: "uppercase" }}>{label}</span>
                        <span style={{ color: "#000000", fontWeight: "700" }}>
                          {value || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "14px" }}>
                <h4 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#0369a1", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={14} color="#0284c7" /> Passenger List ({selectedRegistration.passengerDetails?.length || 0})
                </h4>
                {selectedRegistration.passengerDetails?.length > 0 ? (
                  selectedRegistration.passengerDetails.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e0f2fe" }}>
                      <span style={{ color: "#000000", fontWeight: "700" }}>{i + 1}. {p.name || "-"}</span>
                      <span style={{ color: "#64748b" }}>{p.age} yrs, {p.gender}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#64748b" }}>No additional passengers provided.</p>
                )}
              </div>

              {selectedRegistration.message && (
                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Note</span>
                  <p style={{ color: "#0f172a", fontStyle: "italic", margin: 0 }}>{selectedRegistration.message}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e0f2fe", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setViewDetailsModal(false)} style={{ padding: "10px 20px", borderRadius: "10px", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#475569", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>Close</button>
              <button
                onClick={() => { setViewDetailsModal(false); handlePrintPass(selectedRegistration); }}
                style={{ padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "none", color: "#ffffff", cursor: "pointer", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(2,132,199,0.3)" }}
              >
                <Printer size={15} color="#ffffff" /> Print PDF Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: QR PREVIEW
      ════════════════════════════════════════ */}
      {previewQrModal && selectedRegistration && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "360px", background: "#ffffff", border: "1px solid #e0f2fe", borderRadius: "20px", padding: "28px", textAlign: "center", boxShadow: "0 25px 80px rgba(2,132,199,0.15)", position: "relative" }}>
            <button onClick={() => setPreviewQrModal(false)} style={{ position: "absolute", right: "16px", top: "16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#0284c7" }}><X size={15} /></button>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Digital Pass QR Code</h3>
            <p style={{ fontSize: "12px", color: "#0284c7", fontFamily: "monospace", fontWeight: "800", marginBottom: "20px" }}>{selectedRegistration.id}</p>
            {previewQrUrl && (
              <div style={{ padding: "14px", background: "#ffffff", borderRadius: "14px", border: "1px solid #bae6fd", display: "inline-block", marginBottom: "16px", boxShadow: "0 4px 14px rgba(2,132,199,0.1)" }}>
                <Image src={previewQrUrl} alt="Pass QR" width={200} height={200} unoptimized />
              </div>
            )}
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "12px", textAlign: "left", fontSize: "11px", marginBottom: "14px" }}>
              <p style={{ color: "#475569", margin: "0 0 4px" }}><strong style={{ color: "#000000" }}>Vehicle:</strong> {selectedRegistration.vehicleNumber}</p>
              <p style={{ color: "#475569", margin: "0 0 4px" }}><strong style={{ color: "#000000" }}>Driver/Owner:</strong> {selectedRegistration.ownerName || selectedRegistration.driverName}</p>
              <p style={{ color: "#475569", margin: 0 }}><strong style={{ color: "#000000" }}>Status:</strong> <StatusBadge status={selectedRegistration.status} /></p>
            </div>
            <button onClick={() => handlePrintPass(selectedRegistration)} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "none", borderRadius: "10px", color: "#ffffff", fontWeight: "800", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", gap: "6px", boxShadow: "0 4px 12px rgba(2,132,199,0.3)" }}>
              <Printer size={15} color="#ffffff" /> Print PDF Pass
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: QR VERIFY
      ════════════════════════════════════════ */}
      {qrVerifyModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "440px", background: "#ffffff", border: "1px solid #e0f2fe", borderRadius: "20px", padding: "28px", boxShadow: "0 25px 80px rgba(2,132,199,0.15)", position: "relative" }}>
            <button onClick={() => setQrVerifyModal(false)} style={{ position: "absolute", right: "16px", top: "16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#0284c7" }}><X size={15} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "12px", background: "linear-gradient(135deg, #0284c7, #0369a1)", borderRadius: "14px", boxShadow: "0 4px 12px rgba(2,132,199,0.3)" }}><ScanLine size={22} color="#ffffff" /></div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>QR Checkpost Verifier</h3>
                <p style={{ fontSize: "11px", color: "#0284c7", margin: "2px 0 0", fontWeight: "600" }}>Scan or paste Pass ID to verify validity</p>
              </div>
            </div>
            <form onSubmit={handleVerifyQr} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                value={qrInputCode}
                onChange={(e) => setQrInputCode(e.target.value)}
                placeholder="Enter Pass ID e.g. YS-2026-XXXX"
                required
                style={{ flex: 1, background: "#f8fafc", border: "1px solid #bae6fd", borderRadius: "10px", padding: "11px 14px", fontSize: "12px", color: "#000000", outline: "none", fontFamily: "monospace", fontWeight: "700" }}
              />
              <button
                type="submit"
                disabled={qrVerifyLoading}
                style={{ padding: "11px 18px", background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "none", borderRadius: "10px", color: "#ffffff", fontWeight: "800", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(2,132,199,0.25)" }}
              >
                {qrVerifyLoading ? "Verifying..." : "Verify"}
              </button>
            </form>
            {qrVerifyResult && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "800", color: "#0369a1" }}>STATUS: {qrVerifyResult.status}</span>
                  <span style={{ fontWeight: "800", color: qrVerifyResult.verified ? "#166534" : "#991b1b" }}>
                    {qrVerifyResult.verified ? "✓ AUTHENTIC" : "✕ UNVERIFIED"}
                  </span>
                </div>
                <p style={{ color: "#475569", margin: "0 0 8px" }}>{qrVerifyResult.message}</p>
                {qrVerifyResult.registration && (
                  <div style={{ paddingTop: "10px", borderTop: "1px solid #bae6fd", display: "flex", flexDirection: "column", gap: "4px", fontFamily: "monospace", fontSize: "11px", color: "#0f172a" }}>
                    <p style={{ margin: 0 }}><strong style={{ color: "#0284c7" }}>ID:</strong> {qrVerifyResult.registration.id}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: "#0284c7" }}>Vehicle:</strong> {qrVerifyResult.registration.vehicleNumber}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: "#0284c7" }}>Driver:</strong> {qrVerifyResult.registration.ownerName || qrVerifyResult.registration.driverName}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: "#0284c7" }}>Route:</strong> {qrVerifyResult.registration.travelFrom} → {qrVerifyResult.registration.travelTo}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: EDIT REGISTRATION
      ════════════════════════════════════════ */}
      {editModal && selectedRegistration && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", padding: "16px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: "500px", background: "#ffffff", border: "1px solid #e0f2fe", borderRadius: "20px", padding: "28px", boxShadow: "0 25px 80px rgba(2,132,199,0.15)", position: "relative", margin: "auto" }}>
            <button onClick={() => setEditModal(false)} style={{ position: "absolute", right: "16px", top: "16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#0284c7" }}><X size={15} /></button>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Edit Registration Data</h3>
            <p style={{ fontSize: "12px", color: "#0284c7", fontFamily: "monospace", fontWeight: "800", marginBottom: "20px" }}>{selectedRegistration.id}</p>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Vehicle Number", key: "vehicleNumber", type: "text" },
                { label: "Email Address", key: "email", type: "email" },
                { label: "Registration Password", key: "registrationPassword", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "11px", color: "#475569", fontWeight: "800", marginBottom: "5px", textTransform: "uppercase" }}>{label}</label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    style={{ width: "100%", background: "#f8fafc", border: "1px solid #bae6fd", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#000000", outline: "none", boxSizing: "border-box", fontWeight: "700" }}
                  />
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#475569", fontWeight: "800", marginBottom: "5px", textTransform: "uppercase" }}>Vehicle Category</label>
                  <select
                    value={editForm.vehicleType || "private"}
                    onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                    style={{ width: "100%", background: "#f8fafc", border: "1px solid #bae6fd", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#000000", outline: "none", fontWeight: "700" }}
                  >
                    <option value="private">Private</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#475569", fontWeight: "800", marginBottom: "5px", textTransform: "uppercase" }}>Approval Status</label>
                  <select
                    value={editForm.status || "Pending"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: "100%", background: "#f8fafc", border: "1px solid #bae6fd", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#000000", outline: "none", fontWeight: "700" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Travel From", key: "travelFrom" },
                  { label: "Travel To", key: "travelTo" },
                  { label: "Owner / Driver Name", key: "ownerName" },
                ].map(({ label, key }) => (
                  <div key={key} style={{ gridColumn: key === "ownerName" ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#475569", fontWeight: "800", marginBottom: "5px", textTransform: "uppercase" }}>{label}</label>
                    <input
                      type="text"
                      value={editForm[key] || ""}
                      onChange={(e) => {
                        const update = { ...editForm, [key]: e.target.value };
                        if (key === "ownerName") update.driverName = e.target.value;
                        setEditForm(update);
                      }}
                      style={{ width: "100%", background: "#f8fafc", border: "1px solid #bae6fd", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#000000", outline: "none", boxSizing: "border-box", fontWeight: "700" }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button type="button" onClick={() => setEditModal(false)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "10px", color: "#475569", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "none", borderRadius: "10px", color: "#ffffff", cursor: "pointer", fontWeight: "800", fontSize: "12px", boxShadow: "0 4px 12px rgba(2,132,199,0.3)" }}>
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: DELETE CONFIRM
      ════════════════════════════════════════ */}
      {deleteModal && selectedRegistration && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", itemsCenter: "center", justifyCenter: "center", background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "360px", background: "#ffffff", border: "1px solid #e0f2fe", borderRadius: "20px", padding: "28px", textAlign: "center", boxShadow: "0 25px 80px rgba(2,132,199,0.15)", margin: "auto" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 14px" }}>
              <AlertTriangle size={28} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>Delete Registration?</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 20px" }}>
              This will permanently delete registration{" "}
              <span style={{ fontFamily: "monospace", color: "#0284c7", fontWeight: "800" }}>{selectedRegistration.id}</span>.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteModal(false)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "10px", color: "#475569", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>Cancel</button>
              <button onClick={handleDeleteRegistration} disabled={actionLoading} style={{ flex: 1, padding: "11px", background: "#dc2626", border: "none", borderRadius: "10px", color: "#ffffff", cursor: "pointer", fontWeight: "800", fontSize: "12px", boxShadow: "0 4px 12px rgba(220,38,38,0.3)" }}>
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
