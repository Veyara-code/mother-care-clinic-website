import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Heart, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

const COLORS = {
  bg: "#F7F9F9",
  primary: "#2B4C5C",
  primaryDark: "#1A2E35",
  accent: "#E8A0A8",
  accentDark: "#D97F8C",
  text: "#1A2E35",
  textMuted: "#5C7480",
  white: "#FFFFFF",
  border: "#DCE4E4",
  error: "#D9534F",
};

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

export default function AdminLogin() {
  const { signIn, session } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      window.location.hash = "#/admin/dashboard";
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError(signInError.message === "Invalid login credentials"
        ? "Invalid email or password. Please try again."
        : signInError.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: FONT_BODY }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <a href="#/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 32, fontFamily: FONT_BODY, transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}>
          <ArrowLeft size={16} /> Back to website
        </a>

        <div style={{ background: COLORS.white, borderRadius: 20, padding: "44px 38px", border: `1px solid ${COLORS.border}`, boxShadow: "0 20px 50px rgba(26,46,53,0.08)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>
              <Heart size={24} color="#fff" fill="#fff" strokeWidth={0} />
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, color: COLORS.primaryDark, margin: 0 }}>
              Mother Care Clinic
            </h1>
            <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 6, marginBottom: 0 }}>Admin Dashboard Login</p>
          </div>

          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: `${COLORS.error}11`, border: `1px solid ${COLORS.error}33`,
              borderRadius: 10, padding: "12px 14px", marginBottom: 20,
            }}>
              <AlertCircle size={17} color={COLORS.error} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: COLORS.error, fontFamily: FONT_BODY }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: COLORS.primaryDark, marginBottom: 7, fontFamily: FONT_BODY }} htmlFor="admin-email">
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={17} color={COLORS.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mothercareclinic.com"
                  style={{
                    width: "100%", padding: "13px 15px 13px 42px", borderRadius: 12,
                    border: `1.5px solid ${COLORS.border}`, fontFamily: FONT_BODY, fontSize: 14.5,
                    color: COLORS.text, outline: "none", background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 26 }}>
              <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: COLORS.primaryDark, marginBottom: 7, fontFamily: FONT_BODY }} htmlFor="admin-password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} color={COLORS.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "13px 15px 13px 42px", borderRadius: 12,
                    border: `1.5px solid ${COLORS.border}`, fontFamily: FONT_BODY, fontSize: 14.5,
                    color: COLORS.text, outline: "none", background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: COLORS.primary, color: "#fff", border: "none",
                padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: FONT_BODY,
                opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12.5, color: COLORS.textMuted, marginTop: 24, fontFamily: FONT_BODY }}>
          Authorized clinic staff only. Contact your administrator for access.
        </p>
      </div>
    </div>
  );
}
