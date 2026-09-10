import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu, X, Phone, MessageCircle, Mail, MapPin, Clock,
  Heart, Baby, Stethoscope, Activity, ShieldCheck, Users,
  Star, ChevronDown, ChevronRight, CheckCircle2, Calendar, Languages,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/translations/translations";
import { supabase } from "@/lib/supabase";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
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
};

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

/* ============================================================
   TRANSLATION HELPER
   ============================================================ */
function useT() {
  const { language } = useLanguage();
  const t = useMemo(() => {
    const fn = (key) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language] ?? entry.en ?? key;
    };
    fn.lang = language;
    return fn;
  }, [language]);
  return t;
}

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

function GrowthArc({ className = "", style = {}, stroke = COLORS.accent, opacity = 1 }) {
  // Signature motif: a gentle rising arc, echoing the arc of pregnancy/care journey.
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 70 C 80 70, 90 10, 150 10 S 220 70, 298 20"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: FONT_BODY,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: COLORS.accentDark,
        marginBottom: 14,
      }}
    >
      <span style={{ width: 28, height: 2, background: COLORS.accentDark, display: "inline-block", borderRadius: 2 }} />
      {children}
    </div>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function Navbar({ onBook }) {
  const t = useT();
  const { language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.doctors"), href: "#doctors" },
    { label: t("nav.appointment"), href: "#appointment" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const langButtonStyle = {
    background: COLORS.white,
    color: COLORS.primaryDark,
    border: `1px solid ${COLORS.border}`,
    padding: "9px 14px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "border-color 0.2s, color 0.2s",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(247,249,249,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <nav
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT_BODY,
        }}
      >
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <img
            src="/mcc-logo-pink.png"
            alt="Mother Care Clinic logo"
            style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0 }}
          />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: COLORS.primaryDark }}>
            Mother Care <span style={{ color: COLORS.accentDark }}>Clinic</span>
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="mc-desktop-nav">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
              style={{
                fontSize: 14.5, fontWeight: 500, color: COLORS.text,
                textDecoration: "none", padding: "8px 14px", borderRadius: 8,
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.bgAlt; e.currentTarget.style.color = COLORS.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.text; }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={toggleLanguage}
            className="mc-desktop-nav"
            style={langButtonStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
            aria-label="Toggle language"
          >
            <Languages size={15} />
            {language === "en" ? t("lang.toggleToUrdu") : t("lang.toggleToEnglish")}
          </button>
          <button
            onClick={onBook}
            className="mc-desktop-nav"
            style={{
              background: COLORS.primary, color: "#fff", border: "none",
              padding: "11px 22px", borderRadius: 999, fontSize: 14.5, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY,
              boxShadow: "0 4px 14px rgba(43,76,92,0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {t("nav.bookAppointment")}
          </button>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="mc-mobile-toggle"
            style={{
              display: "none", background: COLORS.white, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, width: 42, height: 42, alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="mc-mobile-menu"
          style={{
            background: COLORS.white, borderTop: `1px solid ${COLORS.border}`,
            padding: "14px 24px 22px", display: "flex", flexDirection: "column", gap: 2,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
              style={{
                padding: "13px 8px", fontSize: 15.5, fontWeight: 500, color: COLORS.text,
                textDecoration: "none", borderBottom: `1px solid ${COLORS.bgAlt}`,
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            style={{
              ...langButtonStyle,
              marginTop: 14, width: "100%", justifyContent: "center",
            }}
          >
            <Languages size={15} />
            {language === "en" ? t("lang.toggleToUrdu") : t("lang.toggleToEnglish")}
          </button>
          <button
            onClick={() => { setOpen(false); onBook(); }}
            style={{
              marginTop: 14, background: COLORS.primary, color: "#fff", border: "none",
              padding: "13px 22px", borderRadius: 999, fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT_BODY,
            }}
          >
            {t("nav.bookAppointment")}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .mc-desktop-nav { display: none !important; }
          .mc-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ onBook }) {
  const t = useT();
  return (
    <section
      id="home"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "72px 24px 100px",
        background: `radial-gradient(ellipse 1200px 600px at 80% -10%, #EAF1F1 0%, ${COLORS.bg} 55%)`,
      }}
    >
      <div
        style={{
          maxWidth: 1240, margin: "0 auto", display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center",
        }}
        className="mc-hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: COLORS.white, border: `1px solid ${COLORS.border}`,
              borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 600,
              color: COLORS.primary, fontFamily: FONT_BODY, marginBottom: 26,
              boxShadow: "0 2px 10px rgba(43,76,92,0.06)",
            }}
          >
            <ShieldCheck size={15} color={COLORS.success} />
            {t("hero.badge")}
          </div>

          <h1
            style={{
              fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(38px, 5vw, 58px)",
              lineHeight: 1.08, color: COLORS.primaryDark, margin: 0, letterSpacing: "-0.01em",
            }}
          >
            {t("hero.headingPrefix")}
            <span style={{ color: COLORS.accentDark, fontStyle: "italic" }}>{t("hero.headingHighlight")}</span>
            {t("hero.headingSuffix")}
          </h1>

          <p
            style={{
              fontFamily: FONT_BODY, fontSize: 18, lineHeight: 1.65, color: COLORS.textMuted,
              maxWidth: 480, margin: "22px 0 34px",
            }}
          >
            {t("hero.paragraph")}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            <button
              onClick={onBook}
              style={{
                background: COLORS.primary, color: "#fff", border: "none",
                padding: "16px 30px", borderRadius: 999, fontSize: 15.5, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT_BODY, display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 8px 24px rgba(43,76,92,0.28)", transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Calendar size={17} /> {t("hero.bookAppointment")}
            </button>
            <a
              href="https://wa.me/923004304110"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: COLORS.white, color: COLORS.primaryDark, border: `1.5px solid ${COLORS.border}`,
                padding: "16px 30px", borderRadius: 999, fontSize: 15.5, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT_BODY, display: "inline-flex", alignItems: "center", gap: 8,
                textDecoration: "none", transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
            >
              <MessageCircle size={17} /> {t("hero.whatsapp")}
            </a>
          </div>

          <GrowthArc style={{ width: 220, height: 56 }} />
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute", top: "-8%", right: "-10%", width: "85%", height: "85%",
              background: `linear-gradient(135deg, ${COLORS.accent}33, ${COLORS.primaryLight}22)`,
              borderRadius: "48% 52% 62% 38% / 45% 42% 58% 55%",
              filter: "blur(0px)", zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative", zIndex: 1, background: COLORS.white,
              borderRadius: "42% 58% 60% 40% / 48% 44% 56% 52%",
              overflow: "hidden", aspectRatio: "1/1", boxShadow: "0 30px 70px rgba(26,46,53,0.16)",
            }}
          >
            <img
              src="/hero-mother-baby.png"
              alt="Mother holding newborn baby, illustrating the clinic's maternity care"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              position: "absolute", bottom: 14, left: -18, background: COLORS.white,
              borderRadius: 18, padding: "16px 20px", boxShadow: "0 16px 40px rgba(26,46,53,0.14)",
              display: "flex", alignItems: "center", gap: 12, zIndex: 2,
            }}
            className="mc-hero-float"
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: `${COLORS.success}1A`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Baby size={20} color={COLORS.success} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15, color: COLORS.primaryDark }}>{t("hero.statValue")}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.textMuted }}>{t("hero.statLabel")}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mc-hero-grid { grid-template-columns: 1fr !important; }
          .mc-hero-float { left: 0 !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   STATS
   ============================================================ */
function useCountUp(target, duration = 1600, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function StatItem({ value, suffix, label, start }) {
  const count = useCountUp(value, 1600, start);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 600, color: COLORS.white }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: "#CBDADE", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Stats() {
  const t = useT();
  const [ref, visible] = useReveal();
  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(120deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100, margin: "0 auto", display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", gap: 32,
        }}
        className="mc-stats-grid"
      >
        <StatItem value={50000} suffix="+" label={t("stats.happyMothers")} start={visible} />
        <StatItem value={new Date().getFullYear() - 1996} suffix="+" label={t("stats.yearsExperience")} start={visible} />
        <StatItem value={24} suffix="/7" label={t("stats.emergencySupport")} start={visible} />
        <StatItem value={99} suffix="%" label={t("stats.patientSatisfaction")} start={visible} />
      </div>
      <style>{`@media (max-width: 700px) { .mc-stats-grid { gridTemplateColumns: 1fr 1fr !important; row-gap: 40px !important; } }`}</style>
    </section>
  );
}

/* ============================================================
   ABOUT (supports "About" nav link)
   ============================================================ */
function About() {
  const t = useT();
  return (
    <section id="about" style={{ padding: "110px 24px 90px", background: COLORS.bg }}>
      <div
        style={{
          maxWidth: 1240, margin: "0 auto", display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr", gap: 64, alignItems: "center",
        }}
        className="mc-about-grid"
      >
        <Reveal>
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(26,46,53,0.14)",
            }}>
              <img
                src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=900&q=80"
                alt="Clinic consultation room where doctors meet patients"
                style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                position: "absolute", bottom: -22, right: -22, background: COLORS.accent,
                borderRadius: 20, padding: "20px 26px", boxShadow: "0 20px 40px rgba(232,160,168,0.35)",
              }}
              className="mc-about-badge"
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, color: "#fff" }}>{`${new Date().getFullYear() - 1996}+ yrs`}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#fff", opacity: 0.9 }}>{t("about.badgeLabel")}</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <SectionEyebrow>{t("about.eyebrow")}</SectionEyebrow>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)",
            color: COLORS.primaryDark, lineHeight: 1.18, margin: "0 0 20px",
          }}>
            {t("about.heading")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, lineHeight: 1.75, color: COLORS.textMuted, marginBottom: 18 }}>
            {t("about.paragraph")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
            {[
              t("about.check1"),
              t("about.check2"),
              t("about.check3"),
              t("about.check4"),
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircle2 size={19} color={COLORS.success} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.text }}>{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .mc-about-grid { grid-template-columns: 1fr !important; }
          .mc-about-badge { right: 0 !important; bottom: -18px !important; padding: 14px 18px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
const SERVICE_KEYS = [
  { key: "pregnancyCare", icon: Heart },
  { key: "normalDelivery", icon: Baby },
  { key: "ultrasound", icon: Activity },
  { key: "gynecology", icon: Users },
  { key: "familyPlanning", icon: ShieldCheck },
  { key: "dilationCurettage", icon: Stethoscope },
  { key: "postpartum", icon: Heart },
];

function ServiceCard({ icon: Icon, title, desc, index }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={index * 60}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: COLORS.white, borderRadius: 20, padding: "30px 26px",
          border: `1px solid ${COLORS.border}`, height: "100%",
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hover ? "0 20px 40px rgba(26,46,53,0.12)" : "0 2px 10px rgba(26,46,53,0.04)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: hover ? COLORS.primary : `${COLORS.primary}14`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 18, transition: "background 0.3s ease",
          }}
        >
          <Icon size={24} color={hover ? "#fff" : COLORS.primary} />
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: COLORS.primaryDark, margin: "0 0 8px" }}>
          {title}
        </h3>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.6, color: COLORS.textMuted, margin: 0 }}>
          {desc}
        </p>
      </div>
    </Reveal>
  );
}

function Services() {
  const t = useT();
  return (
    <section id="services" style={{ padding: "100px 24px", background: COLORS.bgAlt }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><SectionEyebrow>{t("services.eyebrow")}</SectionEyebrow></div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 40px)",
              color: COLORS.primaryDark, margin: "0 0 14px", lineHeight: 1.15,
            }}>
              {t("services.heading")}
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: COLORS.textMuted, margin: 0 }}>
              {t("services.paragraph")}
            </p>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22 }} className="mc-services-grid">
          {SERVICE_KEYS.map((s, i) => (
            <ServiceCard
              key={s.key}
              icon={s.icon}
              title={t(`service.${s.key}.title`)}
              desc={t(`service.${s.key}.desc`)}
              index={i}
            />
          ))}
        </div>
      </div>
      <style>{`
        .mc-services-grid > * { flex: 1 1 calc(25% - 22px); min-width: 240px; }
        @media (max-width: 1000px) { .mc-services-grid > * { flex: 1 1 calc(50% - 22px) !important; } }
        @media (max-width: 560px) { .mc-services-grid > * { flex: 1 1 100% !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   WHY CHOOSE US
   ============================================================ */
const FEATURE_KEYS = [
  { key: "experiencedDoctors", icon: Stethoscope },
  { key: "safeDeliveries", icon: ShieldCheck },
  { key: "modernEquipment", icon: Activity },
  { key: "emergencySupport", icon: Phone },
  { key: "comfortableRooms", icon: Heart },
  { key: "friendlyStaff", icon: Users },
];

function WhyChooseUs() {
  const t = useT();
  return (
    <section style={{ padding: "100px 24px", background: COLORS.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 60 }} className="mc-why-grid">
        <Reveal>
          <SectionEyebrow>{t("why.eyebrow")}</SectionEyebrow>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)",
            color: COLORS.primaryDark, lineHeight: 1.18, margin: "0 0 16px",
          }}>
            {t("why.heading")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.7, color: COLORS.textMuted }}>
            {t("why.paragraph")}
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="mc-features-grid">
          {FEATURE_KEYS.map((f, i) => (
            <Reveal key={f.key} delay={i * 70}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: `${COLORS.accent}22`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <f.icon size={21} color={COLORS.accentDark} />
                </div>
                <div>
                  <h4 style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15.5, color: COLORS.primaryDark, margin: "0 0 5px" }}>
                    {t(`feature.${f.key}.title`)}
                  </h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13.8, lineHeight: 1.55, color: COLORS.textMuted, margin: 0 }}>
                    {t(`feature.${f.key}.desc`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .mc-why-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .mc-features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   DOCTORS
   ============================================================ */
const DOCTORS = [
  {
    key: "saeeda",
    name: "Dr. Saeeda Rehman",
    experienceKey: "doctor.experience.20",
  },
  {
    key: "rashida",
    name: "Dr. Rashida Akhtar",
    experienceKey: "doctor.experience.15",
  },
];

function DoctorCard({ doc, index, onBook }) {
  const t = useT();
  return (
    <Reveal delay={index * 90}>
      <div style={{
        background: COLORS.white, borderRadius: 22, overflow: "hidden",
        border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 16px rgba(26,46,53,0.05)",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          padding: "28px 22px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Stethoscope size={28} color="#fff" />
          </div>
        </div>
        <div style={{ padding: "22px 22px 24px" }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: COLORS.primaryDark, margin: "0 0 4px" }}>
            {t(`doctor.${doc.key}.name`)}
          </h3>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: COLORS.accentDark, marginBottom: 10 }}>
            {t(`doctor.${doc.key}.role`)}
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.textMuted, margin: "0 0 18px" }}>{t(doc.experienceKey)}</p>
          <button
            onClick={onBook}
            style={{
              width: "100%", background: COLORS.bgAlt, color: COLORS.primaryDark, border: "none",
              padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: FONT_BODY, transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.bgAlt; e.currentTarget.style.color = COLORS.primaryDark; }}
          >
            {t("doctors.bookAppointment")}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function Doctors({ onBook }) {
  const t = useT();
  return (
    <section id="doctors" style={{ padding: "100px 24px", background: COLORS.bgAlt }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><SectionEyebrow>{t("doctors.eyebrow")}</SectionEyebrow></div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 40px)", color: COLORS.primaryDark, margin: "0 0 14px" }}>
              {t("doctors.heading")}
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: COLORS.textMuted, margin: 0 }}>
              {t("doctors.paragraph")}
            </p>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26 }} className="mc-doctors-grid">
          {DOCTORS.map((d, i) => <DoctorCard key={d.key} doc={d} index={i} onBook={onBook} />)}
        </div>
      </div>
      <style>{`
        .mc-doctors-grid > * { flex: 1 1 340px; max-width: 380px; }
        @media (max-width: 850px) { .mc-doctors-grid > * { flex: 1 1 100% !important; max-width: 480px; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   APPOINTMENT FORM
   ============================================================ */
const DOCTOR_OPTIONS = DOCTORS.map((d) => ({ value: d.name, labelKey: `doctor.${d.key}.name` }));
const SERVICE_OPTIONS = [
  ...SERVICE_KEYS.map((s) => ({ value: s.key, labelKey: `service.${s.key}.title` })),
  { value: "csection", labelKey: "service.csection.title" },
];

function AppointmentForm({ formRef }) {
  const t = useT();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", age: "", doctor: "", service: "",
    date: "", reason: "", message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t("form.error.name");
    if (!form.phone.trim()) newErrors.phone = t("form.error.phone");
    if (!form.doctor) newErrors.doctor = t("form.error.doctor");
    if (!form.service) newErrors.service = t("form.error.service");
    if (!form.date) newErrors.date = t("form.error.date");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("submitting");
    const insertData = {
      patient_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      age: form.age ? Number(form.age) : null,
      doctor: form.doctor,
      service: form.service,
      appointment_date: form.date,
      reason: form.reason.trim() || null,
    };
    const { error } = await supabase.from("appointments").insert(insertData);
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      // Fire-and-forget email notification; never block the patient's confirmation.
      try {
        const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-appointment-email`;
        await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(insertData),
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%", padding: "13px 15px", borderRadius: 12,
    border: `1.5px solid ${hasError ? "#D9534F" : COLORS.border}`,
    fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.text,
    outline: "none", background: "#fff", transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block", fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600,
    color: COLORS.primaryDark, marginBottom: 7,
  };

  if (status === "success" || status === "error") {
    const isSuccess = status === "success";
    return (
      <div
        style={{
          background: COLORS.white, borderRadius: 24, padding: "60px 40px",
          textAlign: "center", border: `1px solid ${COLORS.border}`,
          boxShadow: "0 20px 50px rgba(26,46,53,0.08)",
        }}
      >
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: isSuccess ? `${COLORS.success}18` : `${"#D9534F"}18`,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px",
        }}>
          {isSuccess
            ? <CheckCircle2 size={34} color={COLORS.success} />
            : <X size={34} color="#D9534F" />}
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, color: COLORS.primaryDark, margin: "0 0 12px" }}>
          {isSuccess ? t("form.successTitle") : t("form.errorTitle")}
        </h3>
        <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, color: COLORS.textMuted, maxWidth: 420, margin: "0 auto 26px", lineHeight: 1.6 }}>
          {isSuccess ? t("form.successText") : t("form.errorText")}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            if (isSuccess) setForm({ name: "", phone: "", email: "", age: "", doctor: "", service: "", date: "", reason: "", message: "" });
          }}
          style={{
            background: COLORS.primary, color: "#fff", border: "none", padding: "13px 28px",
            borderRadius: 999, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY,
          }}
        >
          {isSuccess ? t("form.bookAnother") : t("form.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{
        background: COLORS.white, borderRadius: 24, padding: "40px", 
        border: `1px solid ${COLORS.border}`, boxShadow: "0 20px 50px rgba(26,46,53,0.08)",
      }}
      className="mc-appointment-form"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="mc-form-grid">
        <div>
          <label style={labelStyle} htmlFor="mc-name">{t("form.name")}</label>
          <input id="mc-name" style={inputStyle(errors.name)} value={form.name} onChange={update("name")} placeholder={t("form.placeholder.name")} />
          {errors.name && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.name}</span>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-phone">{t("form.phone")}</label>
          <input id="mc-phone" style={inputStyle(errors.phone)} value={form.phone} onChange={update("phone")} placeholder={t("form.placeholder.phone")} />
          {errors.phone && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.phone}</span>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-email">{t("form.email")}</label>
          <input id="mc-email" type="email" style={inputStyle(false)} value={form.email} onChange={update("email")} placeholder={t("form.placeholder.email")} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-age">{t("form.age")}</label>
          <input id="mc-age" type="number" min="0" style={inputStyle(false)} value={form.age} onChange={update("age")} placeholder={t("form.placeholder.age")} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-doctor">{t("form.doctor")}</label>
          <select id="mc-doctor" style={inputStyle(errors.doctor)} value={form.doctor} onChange={update("doctor")}>
            <option value="">{t("form.chooseDoctor")}</option>
            {DOCTOR_OPTIONS.map((d) => <option key={d.value} value={d.value}>{t(d.labelKey)}</option>)}
          </select>
          {errors.doctor && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.doctor}</span>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-service">{t("form.service")}</label>
          <select id="mc-service" style={inputStyle(errors.service)} value={form.service} onChange={update("service")}>
            <option value="">{t("form.chooseService")}</option>
            {SERVICE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{t(s.labelKey)}</option>)}
          </select>
          {errors.service && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.service}</span>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-date">{t("form.date")}</label>
          <input id="mc-date" type="date" style={inputStyle(errors.date)} value={form.date} onChange={update("date")} />
          {errors.date && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.date}</span>}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="mc-reason">{t("form.reason")}</label>
        <input id="mc-reason" style={inputStyle(false)} value={form.reason} onChange={update("reason")} placeholder={t("form.placeholder.reason")} />
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="mc-message">{t("form.message")}</label>
        <textarea
          id="mc-message" rows={4} style={{ ...inputStyle(false), resize: "vertical", fontFamily: FONT_BODY }}
          value={form.message} onChange={update("message")} placeholder={t("form.placeholder.message")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          marginTop: 26, width: "100%", background: COLORS.primary, color: "#fff", border: "none",
          padding: "16px", borderRadius: 14, fontSize: 15.5, fontWeight: 600, cursor: "pointer",
          fontFamily: FONT_BODY, boxShadow: "0 10px 26px rgba(43,76,92,0.28)",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? t("form.submitting") : t("form.submit")}
      </button>

      <style>{`@media (max-width: 640px) { .mc-form-grid { grid-template-columns: 1fr !important; } .mc-appointment-form { padding: 26px !important; } }`}</style>
    </form>
  );
}

function Appointment({ formRef }) {
  const t = useT();
  return (
    <section id="appointment" style={{ padding: "100px 24px", background: `linear-gradient(180deg, ${COLORS.bg}, ${COLORS.bgAlt})` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "0.75fr 1.25fr", gap: 56 }} className="mc-appt-grid">
        <Reveal>
          <div style={{ display: "flex" }}><SectionEyebrow>{t("appt.eyebrow")}</SectionEyebrow></div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)",
            color: COLORS.primaryDark, lineHeight: 1.18, margin: "0 0 16px",
          }}>
            {t("appt.heading")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.7, color: COLORS.textMuted, marginBottom: 26 }}>
            {t("appt.paragraph")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: Clock, text: t("appt.item1") },
              { icon: Phone, text: t("appt.item2") },
              { icon: ShieldCheck, text: t("appt.item3") },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: `${COLORS.success}18`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <item.icon size={17} color={COLORS.success} />
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: COLORS.text }}>{item.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <AppointmentForm formRef={formRef} />
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px) { .mc-appt-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
const FAQ_KEYS = ["1", "2", "3", "4", "5"];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <Reveal delay={index * 60}>
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "22px 0" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "start",
          }}
          aria-expanded={open}
        >
          <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 16, color: COLORS.primaryDark }}>{q}</span>
          <ChevronDown
            size={19} color={COLORS.primary}
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0, marginInlineStart: 12 }}
          />
        </button>
        <div style={{
          maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease",
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.7, color: COLORS.textMuted, margin: "14px 0 0" }}>{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

function FAQ() {
  const t = useT();
  return (
    <section style={{ padding: "100px 24px", background: COLORS.bgAlt }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 46 }}>
            <div style={{ display: "flex", justifyContent: "center" }}><SectionEyebrow>{t("faq.eyebrow")}</SectionEyebrow></div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(26px, 3.2vw, 36px)", color: COLORS.primaryDark, margin: 0 }}>
              {t("faq.heading")}
            </h2>
          </div>
        </Reveal>
        <div>
          {FAQ_KEYS.map((k, i) => <FAQItem key={k} q={t(`faq.${k}.q`)} a={t(`faq.${k}.a`)} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */
/* ============================================================
   CONTACT: ASK A QUESTION FORM
   ============================================================ */
function QuestionForm() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t("contact.form.error.name");
    if (!form.email.trim() && !form.phone.trim()) newErrors.contact = t("contact.form.error.contact");
    if (!form.message.trim()) newErrors.message = t("contact.form.error.message");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("submitting");
    const insertData = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    };
    const { error } = await supabase.from("questions").insert(insertData);
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      // Fire-and-forget email notification; never block the visitor's confirmation.
      try {
        const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-question-email`;
        await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(insertData),
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%", padding: "13px 15px", borderRadius: 12,
    border: `1.5px solid ${hasError ? "#D9534F" : COLORS.border}`,
    fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.text,
    outline: "none", background: "#fff", transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block", fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600,
    color: COLORS.primaryDark, marginBottom: 7,
  };

  if (status === "success" || status === "error") {
    const isSuccess = status === "success";
    return (
      <div style={{
        background: COLORS.white, borderRadius: 22, padding: "48px 32px", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", border: `1px solid ${COLORS.border}`, boxSizing: "border-box",
      }}>
        <div style={{
          width: 62, height: 62, borderRadius: "50%",
          background: isSuccess ? `${COLORS.success}18` : `${"#D9534F"}18`,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
        }}>
          {isSuccess
            ? <CheckCircle2 size={30} color={COLORS.success} />
            : <X size={30} color="#D9534F" />}
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: COLORS.primaryDark, margin: "0 0 10px" }}>
          {isSuccess ? t("contact.form.successTitle") : t("contact.form.errorTitle")}
        </h3>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.textMuted, maxWidth: 340, margin: "0 0 22px", lineHeight: 1.6 }}>
          {isSuccess ? t("contact.form.successText") : t("contact.form.errorText")}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setErrors({});
            if (isSuccess) setForm({ name: "", email: "", phone: "", message: "" });
          }}
          style={{
            background: COLORS.primary, color: "#fff", border: "none", padding: "12px 26px",
            borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY,
          }}
        >
          {isSuccess ? t("contact.form.askAnother") : t("contact.form.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: COLORS.white, borderRadius: 22, padding: "32px", height: "100%",
        border: `1px solid ${COLORS.border}`, boxSizing: "border-box",
      }}
    >
      <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: COLORS.primaryDark, margin: "0 0 6px" }}>
        {t("contact.form.heading")}
      </h3>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.textMuted, margin: "0 0 22px", lineHeight: 1.5 }}>
        {t("contact.form.subheading")}
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor="mc-q-name">{t("contact.form.name")}</label>
        <input id="mc-q-name" style={inputStyle(errors.name)} value={form.name} onChange={update("name")} placeholder={t("contact.form.placeholder.name")} />
        {errors.name && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.name}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="mc-q-grid">
        <div>
          <label style={labelStyle} htmlFor="mc-q-email">{t("contact.form.email")}</label>
          <input id="mc-q-email" type="email" style={inputStyle(errors.contact)} value={form.email} onChange={update("email")} placeholder={t("contact.form.placeholder.email")} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="mc-q-phone">{t("contact.form.phone")}</label>
          <input id="mc-q-phone" style={inputStyle(errors.contact)} value={form.phone} onChange={update("phone")} placeholder={t("contact.form.placeholder.phone")} />
        </div>
      </div>
      {errors.contact && <span style={{ display: "block", marginTop: -10, marginBottom: 14, color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.contact}</span>}

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="mc-q-message">{t("contact.form.message")}</label>
        <textarea
          id="mc-q-message" rows={4} style={{ ...inputStyle(errors.message), resize: "vertical", fontFamily: FONT_BODY }}
          value={form.message} onChange={update("message")} placeholder={t("contact.form.placeholder.message")}
        />
        {errors.message && <span style={{ color: "#D9534F", fontSize: 12.5, fontFamily: FONT_BODY }}>{errors.message}</span>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          width: "100%", background: COLORS.primary, color: "#fff", border: "none",
          padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: FONT_BODY, opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? t("contact.form.submitting") : t("contact.form.submit")}
      </button>

      <style>{`@media (max-width: 480px) { .mc-q-grid { grid-template-columns: 1fr !important; } }`}</style>
    </form>
  );
}

function Contact() {
  const t = useT();
  return (
    <section id="contact" style={{ padding: "100px 24px", background: COLORS.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><SectionEyebrow>{t("contact.eyebrow")}</SectionEyebrow></div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 40px)", color: COLORS.primaryDark, margin: 0 }}>
              {t("contact.heading")}
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40 }} className="mc-contact-grid">
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {[
                { icon: MapPin, title: t("contact.address.title"), lines: [t("contact.address.line1"), t("contact.address.line2")] },
                { icon: Phone, title: t("contact.phone.title"), lines: [t("contact.phone.line")] },
                { icon: MessageCircle, title: t("contact.whatsapp.title"), lines: [t("contact.whatsapp.line")] },
                { icon: Mail, title: t("contact.email.title"), lines: [t("contact.email.line")] },
                { icon: Clock, title: t("contact.hours.title"), lines: [t("contact.hours.line1"), t("contact.hours.line2")] },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: `${COLORS.primary}12`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <item.icon size={19} color={COLORS.primary} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14.5, color: COLORS.primaryDark, marginBottom: 3 }}>{item.title}</div>
                    {item.lines.map((l) => (
                      <div key={l} style={{ fontFamily: FONT_BODY, fontSize: 14, color: COLORS.textMuted }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 28, borderRadius: 20, overflow: "hidden",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 12px 30px rgba(26,46,53,0.08)"
            }}>
              <div style={{ position: "relative", width: "100%", paddingTop: "70%" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d902.8610766728714!2d69.10855536953372!3d25.154471298608673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394e9bdfc5c64421%3A0xd970da22728246d9!2sMother%20care%20clinic!5e0!3m2!1sen!2s!4v1787494341585!5m2!1sen!2s"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Mother Care Clinic location map"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/42SJgEHoAtrcsUPA8"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px", background: COLORS.white, textDecoration: "none",
                  fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: COLORS.primary,
                  transition: "background 0.2s",
                }}
              >
                <MapPin size={16} /> {t("contact.map.openLink")}
              </a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <QuestionForm />
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 850px) { .mc-contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const t = useT();
  return (
    <footer style={{ background: COLORS.primaryDark, padding: "60px 24px 28px", color: "#CBDADE" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1.2fr", gap: 40, marginBottom: 40 }} className="mc-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{
                width: 34, height: 34, borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Heart size={15} color="#fff" fill="#fff" strokeWidth={0} />
              </span>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: "#fff" }}>Mother Care Clinic</span>
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, lineHeight: 1.7, color: "#9FB6BC", maxWidth: 280 }}>
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h5 style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "0.04em" }}>{t("footer.quickLinks")}</h5>
            {[t("footer.link.home"), t("footer.link.about"), t("footer.link.doctors"), t("footer.link.appointment")].map((l) => (
              <div key={l} style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#9FB6BC", marginBottom: 10 }}>{l}</div>
            ))}
          </div>
          <div>
            <h5 style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "0.04em" }}>{t("footer.services")}</h5>
            {[t("footer.service.pregnancyCare"), t("footer.service.delivery"), t("footer.service.ultrasound"), t("footer.service.gynecology")].map((l) => (
              <div key={l} style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#9FB6BC", marginBottom: 10 }}>{l}</div>
            ))}
          </div>
          <div>
            <h5 style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "0.04em" }}>{t("footer.contact")}</h5>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#9FB6BC", marginBottom: 10 }}>{t("contact.phone.line")}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#9FB6BC", marginBottom: 10 }}>{t("contact.email.line")}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#9FB6BC" }}>{t("contact.address.line1")}</div>
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 22,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#7E98A0" }}>
            {t("footer.copyright")}
          </span>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#7E98A0" }}>{t("footer.privacy")}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#7E98A0" }}>{t("footer.terms")}</span>
            <a href="#/admin" style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#9FB6BC", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9FB6BC")}>Admin Login</a>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .mc-footer-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </footer>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function MotherCareClinic() {
  const appointmentFormRef = useRef(null);

  const scrollToBooking = () => {
    const el = document.querySelector("#appointment");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: COLORS.bg, minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${COLORS.accent}55; }
        :focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      <Navbar onBook={scrollToBooking} />
      <Hero onBook={scrollToBooking} />
      <Stats />
      <About />
      <Services />
      <WhyChooseUs />
      <Doctors onBook={scrollToBooking} />
      <Appointment formRef={appointmentFormRef} />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}