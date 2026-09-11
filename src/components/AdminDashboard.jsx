import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase } from "@/lib/supabase";
import {
  Heart, LogOut, Search, Filter, Calendar, Phone, Mail, User,
  CheckCircle2, Clock, XCircle, Activity, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, MessageCircle, Inbox, CalendarDays,
} from "lucide-react";

const COLORS = {
  bg: "#F7F9F9",
  bgAlt: "#EFF3F3",
  primary: "#2B4C5C",
  primaryDark: "#1A2E35",
  primaryLight: "#4A7488",
  accent: "#E8A0A8",
  accentDark: "#D97F8C",
  success: "#3E7561",
  text: "#1A2E35",
  textMuted: "#5C7480",
  white: "#FFFFFF",
  border: "#DCE4E4",
  warning: "#D97706",
  error: "#D9534F",
};

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

const STATUS_CONFIG = {
  Pending: { color: COLORS.warning, bg: "#FEF3C7", icon: Clock },
  Confirmed: { color: COLORS.primaryLight, bg: "#DBEAFE", icon: CheckCircle2 },
  Completed: { color: COLORS.success, bg: "#D1FAE5", icon: Activity },
  Cancelled: { color: COLORS.error, bg: "#FEE2E2", icon: XCircle },
};

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color, padding: "4px 10px",
      borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: FONT_BODY,
      whiteSpace: "nowrap",
    }}>
      <Icon size={13} />
      {status}
    </span>
  );
}

function StatusSelect({ current, onChange, disabled }) {
  return (
    <select
      value={current}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
        fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: COLORS.text,
        cursor: disabled ? "wait" : "pointer", background: COLORS.white, outline: "none",
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("appointments");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Questions ("Have a question?" submissions)
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [questionsSearch, setQuestionsSearch] = useState("");
  const [questionsPage, setQuestionsPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("asc"); // asc = upcoming first
  const [page, setPage] = useState(1);

  // Status update tracking
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: dateSort === "asc" })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Failed to load appointments. Please try again.");
      console.error("Fetch error:", fetchError);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  }, [dateSort]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError("");
    const { data, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setQuestionsError("Failed to load questions. Please try again.");
      console.error("Fetch error:", fetchError);
    } else {
      setQuestions(data || []);
    }
    setQuestionsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Client-side search + status filter
  const filtered = useMemo(() => {
    let result = appointments;

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((a) =>
        (a.patient_name || "").toLowerCase().includes(q) ||
        (a.phone || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [appointments, search, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateSort]);

  // Client-side search for questions
  const filteredQuestions = useMemo(() => {
    const q = questionsSearch.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((item) =>
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.phone || "").toLowerCase().includes(q) ||
      (item.message || "").toLowerCase().includes(q)
    );
  }, [questions, questionsSearch]);

  useEffect(() => {
    setQuestionsPage(1);
  }, [questionsSearch]);

  const questionsTotalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const questionsCurrentPage = Math.min(questionsPage, questionsTotalPages);
  const paginatedQuestions = filteredQuestions.slice(
    (questionsCurrentPage - 1) * PAGE_SIZE,
    questionsCurrentPage * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      setError("Failed to update status. Please try again.");
      console.error("Update error:", updateError);
    } else {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
    setUpdatingId(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDateTime = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Stats summary
  const stats = useMemo(() => {
    const counts = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
    appointments.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });
    return counts;
  }, [appointments]);

  const inputStyle = {
    padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
    fontFamily: FONT_BODY, fontSize: 14, color: COLORS.text, outline: "none",
    background: COLORS.white, boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT_BODY }}>
      {/* Top bar */}
      <header style={{ background: COLORS.primaryDark, padding: "16px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Heart size={15} color="#fff" fill="#fff" strokeWidth={0} />
            </span>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: "#fff" }}>
                Mother Care Clinic
              </div>
              <div style={{ fontSize: 12, color: "#9FB6BC" }}>Admin Dashboard</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, color: "#CBDADE", fontFamily: FONT_BODY }}>
              {user?.email}
            </span>
            <button
              onClick={signOut}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
                padding: "8px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT_BODY, transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <button
            onClick={() => setActiveTab("appointments")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: activeTab === "appointments" ? COLORS.primaryDark : COLORS.white,
              color: activeTab === "appointments" ? "#fff" : COLORS.textMuted,
              border: `1px solid ${activeTab === "appointments" ? COLORS.primaryDark : COLORS.border}`,
              padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY, transition: "all 0.15s",
            }}
          >
            <CalendarDays size={16} /> Appointments
            <span style={{
              background: activeTab === "appointments" ? "rgba(255,255,255,0.2)" : COLORS.bgAlt,
              color: activeTab === "appointments" ? "#fff" : COLORS.textMuted,
              borderRadius: 999, fontSize: 12, fontWeight: 700, padding: "1px 8px",
            }}>
              {appointments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: activeTab === "questions" ? COLORS.primaryDark : COLORS.white,
              color: activeTab === "questions" ? "#fff" : COLORS.textMuted,
              border: `1px solid ${activeTab === "questions" ? COLORS.primaryDark : COLORS.border}`,
              padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY, transition: "all 0.15s",
            }}
          >
            <MessageCircle size={16} /> Questions
            <span style={{
              background: activeTab === "questions" ? "rgba(255,255,255,0.2)" : COLORS.bgAlt,
              color: activeTab === "questions" ? "#fff" : COLORS.textMuted,
              borderRadius: 999, fontSize: 12, fontWeight: 700, padding: "1px 8px",
            }}>
              {questions.length}
            </span>
          </button>
        </div>

        {activeTab === "appointments" ? (
        <>
        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }} className="admin-stats-grid">
          {STATUS_OPTIONS.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <div key={s} style={{
                background: COLORS.white, borderRadius: 16, padding: "20px 22px",
                border: `1px solid ${COLORS.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, fontFamily: FONT_BODY }}>{s}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: cfg.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={18} color={cfg.color} />
                  </div>
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: COLORS.primaryDark }}>
                  {stats[s]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${COLORS.error}11`, border: `1px solid ${COLORS.error}33`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          }}>
            <AlertCircle size={17} color={COLORS.error} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: COLORS.error, fontFamily: FONT_BODY }}>{error}</span>
          </div>
        )}

        {/* Filter bar */}
        <div style={{
          background: COLORS.white, borderRadius: 16, padding: "20px 24px",
          border: `1px solid ${COLORS.border}`, marginBottom: 24,
          display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center",
        }} className="admin-filter-bar">
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <Search size={17} color={COLORS.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              style={{ ...inputStyle, paddingLeft: 42, width: "100%" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color={COLORS.textMuted} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={16} color={COLORS.textMuted} />
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              style={inputStyle}
            >
              <option value="asc">Date: Upcoming First</option>
              <option value="desc">Date: Latest First</option>
            </select>
          </div>

          <button
            onClick={fetchAppointments}
            disabled={loading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: COLORS.bgAlt, color: COLORS.primaryDark, border: `1px solid ${COLORS.border}`,
              padding: "10px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY, opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Table */}
        <div style={{
          background: COLORS.white, borderRadius: 16,
          border: `1px solid ${COLORS.border}`, overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <RefreshCw size={28} color={COLORS.textMuted} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_BODY, margin: 0 }}>Loading appointments...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Calendar size={32} color={COLORS.border} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_BODY, margin: 0 }}>
                {filtered.length === 0 && appointments.length > 0
                  ? "No appointments match your filters."
                  : "No appointments yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div style={{ overflowX: "auto" }} className="admin-table-wrap">
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY }}>
                  <thead>
                    <tr style={{ background: COLORS.bgAlt, borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Patient", "Contact", "Doctor", "Service", "Appt Date", "Reason", "Created", "Status"].map((h) => (
                        <th key={h} style={{
                          padding: "14px 16px", textAlign: "start", fontSize: 12.5,
                          fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em",
                          textTransform: "uppercase", whiteSpace: "nowrap",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((a) => (
                      <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.bgAlt}` }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: "50%", background: `${COLORS.primary}12`,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <User size={15} color={COLORS.primary} />
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.primaryDark }}>{a.patient_name}</div>
                              {a.age != null && <div style={{ fontSize: 12, color: COLORS.textMuted }}>Age: {a.age}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.text }}>
                              <Phone size={12} color={COLORS.textMuted} /> {a.phone}
                            </span>
                            {a.email && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.textMuted }}>
                                <Mail size={12} color={COLORS.textMuted} /> {a.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13.5, color: COLORS.text }}>{a.doctor}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13.5, color: COLORS.text }}>{a.service}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13.5, color: COLORS.text, whiteSpace: "nowrap" }}>{formatDate(a.appointment_date)}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textMuted, maxWidth: 180 }}>{a.reason || "—"}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12.5, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{formatDateTime(a.created_at)}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <StatusSelect
                            current={a.status || "Pending"}
                            onChange={(newStatus) => handleStatusChange(a.id, newStatus)}
                            disabled={updatingId === a.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="admin-cards" style={{ display: "none" }}>
                {paginated.map((a) => (
                  <div key={a.id} style={{ padding: "18px 20px", borderBottom: `1px solid ${COLORS.bgAlt}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.primaryDark }}>{a.patient_name}</div>
                        {a.age != null && <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>Age: {a.age}</div>}
                      </div>
                      <StatusBadge status={a.status || "Pending"} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13, color: COLORS.text, marginBottom: 12 }}>
                      <span><Phone size={12} color={COLORS.textMuted} /> {a.phone}</span>
                      {a.email && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}><Mail size={12} color={COLORS.textMuted} /> {a.email}</span>}
                      <span>Doctor: {a.doctor}</span>
                      <span>Service: {a.service}</span>
                      <span>Date: {formatDate(a.appointment_date)}</span>
                      <span>Created: {formatDate(a.created_at)}</span>
                    </div>
                    {a.reason && <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>Reason: {a.reason}</div>}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.textMuted }}>Update status:</span>
                      <StatusSelect
                        current={a.status || "Pending"}
                        onChange={(newStatus) => handleStatusChange(a.id, newStatus)}
                        disabled={updatingId === a.id}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 24px", borderTop: `1px solid ${COLORS.bgAlt}`,
                }}>
                  <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_BODY }}>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: currentPage === 1 ? COLORS.bgAlt : COLORS.white,
                        color: currentPage === 1 ? COLORS.textMuted : COLORS.primaryDark,
                        border: `1px solid ${COLORS.border}`, padding: "8px 14px",
                        borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                        fontFamily: FONT_BODY, opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      <ChevronLeft size={15} /> Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: currentPage === totalPages ? COLORS.bgAlt : COLORS.white,
                        color: currentPage === totalPages ? COLORS.textMuted : COLORS.primaryDark,
                        border: `1px solid ${COLORS.border}`, padding: "8px 14px",
                        borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                        fontFamily: FONT_BODY, opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </>
        ) : (
        <>
        {/* Error banner */}
        {questionsError && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${COLORS.error}11`, border: `1px solid ${COLORS.error}33`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          }}>
            <AlertCircle size={17} color={COLORS.error} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: COLORS.error, fontFamily: FONT_BODY }}>{questionsError}</span>
          </div>
        )}

        {/* Filter bar */}
        <div style={{
          background: COLORS.white, borderRadius: 16, padding: "20px 24px",
          border: `1px solid ${COLORS.border}`, marginBottom: 24,
          display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center",
        }}>
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <Search size={17} color={COLORS.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              value={questionsSearch}
              onChange={(e) => setQuestionsSearch(e.target.value)}
              placeholder="Search by name, email, phone, or message..."
              style={{ ...inputStyle, paddingLeft: 42, width: "100%" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
            />
          </div>

          <button
            onClick={fetchQuestions}
            disabled={questionsLoading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: COLORS.bgAlt, color: COLORS.primaryDark, border: `1px solid ${COLORS.border}`,
              padding: "10px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY, opacity: questionsLoading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Questions list */}
        <div style={{
          background: COLORS.white, borderRadius: 16,
          border: `1px solid ${COLORS.border}`, overflow: "hidden",
        }}>
          {questionsLoading ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <RefreshCw size={28} color={COLORS.textMuted} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_BODY, margin: 0 }}>Loading questions...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : paginatedQuestions.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Inbox size={32} color={COLORS.border} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_BODY, margin: 0 }}>
                {filteredQuestions.length === 0 && questions.length > 0
                  ? "No questions match your search."
                  : "No questions yet."}
              </p>
            </div>
          ) : (
            <>
              {paginatedQuestions.map((qItem) => (
                <div key={qItem.id} style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.bgAlt}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", background: `${COLORS.primary}12`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <User size={15} color={COLORS.primary} />
                      </div>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.primaryDark, fontFamily: FONT_BODY }}>
                        {qItem.name}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_BODY }}>
                      {formatDateTime(qItem.created_at)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 10 }}>
                    {qItem.email && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.text, fontFamily: FONT_BODY }}>
                        <Mail size={12} color={COLORS.textMuted} /> {qItem.email}
                      </span>
                    )}
                    {qItem.phone && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.text, fontFamily: FONT_BODY }}>
                        <Phone size={12} color={COLORS.textMuted} /> {qItem.phone}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: COLORS.text, fontFamily: FONT_BODY, lineHeight: 1.6, margin: 0 }}>
                    {qItem.message}
                  </p>
                </div>
              ))}

              {/* Pagination */}
              {questionsTotalPages > 1 && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 24px", borderTop: `1px solid ${COLORS.bgAlt}`,
                }}>
                  <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_BODY }}>
                    Showing {(questionsCurrentPage - 1) * PAGE_SIZE + 1}–{Math.min(questionsCurrentPage * PAGE_SIZE, filteredQuestions.length)} of {filteredQuestions.length}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setQuestionsPage((p) => Math.max(1, p - 1))}
                      disabled={questionsCurrentPage === 1}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: questionsCurrentPage === 1 ? COLORS.bgAlt : COLORS.white,
                        color: questionsCurrentPage === 1 ? COLORS.textMuted : COLORS.primaryDark,
                        border: `1px solid ${COLORS.border}`, padding: "8px 14px",
                        borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                        fontFamily: FONT_BODY, opacity: questionsCurrentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      <ChevronLeft size={15} /> Prev
                    </button>
                    <button
                      onClick={() => setQuestionsPage((p) => Math.min(questionsTotalPages, p + 1))}
                      disabled={questionsCurrentPage === questionsTotalPages}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: questionsCurrentPage === questionsTotalPages ? COLORS.bgAlt : COLORS.white,
                        color: questionsCurrentPage === questionsTotalPages ? COLORS.textMuted : COLORS.primaryDark,
                        border: `1px solid ${COLORS.border}`, padding: "8px 14px",
                        borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                        fontFamily: FONT_BODY, opacity: questionsCurrentPage === questionsTotalPages ? 0.5 : 1,
                      }}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </>
        )}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-table-wrap { display: none !important; }
          .admin-cards { display: block !important; }
        }
        @media (max-width: 560px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
