import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ServiceImage from "../Images/homebg.jpg";

// ── Static service catalogue ──────────────────────────────────────────────
const SERVICE_GROUPS = [
  {
    category: "Dental & Oral Care",
    color: "#eff6ff",
    accent: "#2563eb",
    slideFrom: "left",          // ← cards slide in from LEFT
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9 2 6 4 6 7c0 1.5.5 2.5.5 2.5S5 14 5 17c0 2 1 3 2.5 3S10 18 12 18s2.5 2 4.5 2S20 19 20 17c0-3-1.5-7.5-1.5-7.5S19 8.5 19 7c0-3-3-5-7-5Z" />
      </svg>
    ),
    services: [
      { name: "Dental Implants",          desc: "Permanent tooth replacement that looks and feels like natural teeth.",         icon: "🦷" },
      { name: "Wisdom Tooth Surgery",     desc: "Safe removal of impacted or problematic wisdom teeth.",                       icon: "🪥" },
      { name: "Facial Trauma Care",       desc: "Emergency and reconstructive care for facial injuries.",                       icon: "🏥" },
      { name: "Oral Surgical Procedures", desc: "Comprehensive oral and maxillofacial surgical treatments.",                    icon: "💉" },
      { name: "Jaw & Facial Disorders",   desc: "Diagnosis and treatment of TMJ and jaw-related conditions.",                   icon: "😮" },
      { name: "Dental Care",             desc: "Complete dental solutions including cleanings, fillings, and extractions.",     icon: "🦷" },
      { name: "Facial Care",             desc: "Specialized facial treatments and non-surgical cosmetic procedures.",           icon: "✨" },
    ],
  },
  {
    category: "General Medicine",
    color: "#f0fdf4",
    accent: "#16a34a",
    slideFrom: "right",         // → cards slide in from RIGHT
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    services: [
      { name: "Preventive Care",            desc: "Health screenings, vaccinations, and wellness check-ups.",                     icon: "🛡️" },
      { name: "Chronic Disease Management", desc: "Ongoing care and management for diabetes, hypertension, and more.",            icon: "📋" },
      { name: "Women's Health",             desc: "Gynaecology, reproductive health, and wellness check-ups for women.",          icon: "👩‍⚕️" },
      { name: "Child Health",               desc: "Paediatric consultations, growth monitoring, and child wellness care.",        icon: "👶" },
      { name: "Geriatric Care",             desc: "Specialised health care and support for elderly patients.",                    icon: "🧓" },
      { name: "Vaccination",                desc: "Adult and child immunisation for a wide range of diseases.",                   icon: "💉" },
      { name: "Health Counselling",         desc: "Personalised guidance on lifestyle, diet, and mental wellness.",               icon: "💬" },
      { name: "Family Medicine",            desc: "Comprehensive primary care for all ages — from newborns to seniors.",          icon: "🏠" },
    ],
  },
];

// ── Hook: observe element and fire once when visible ──────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Individual group section with its own observer ────────────────────────
function ServiceGroup({ group, gi }) {
  const [headerRef, headerVisible] = useInView(0.15);
  const [gridRef,   gridVisible]   = useInView(0.05);

  const fromLeft  = group.slideFrom === "left";
  const hiddenX   = fromLeft ? "-80px" : "80px";

  return (
    <div style={{ marginBottom: 80 }}>

      {/* ── Group header – slides in from its side ── */}
      <div
        ref={headerRef}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: 32, paddingBottom: 18,
          borderBottom: `3px solid ${group.accent}22`,
          opacity:   headerVisible ? 1 : 0,
          transform: headerVisible ? "translateX(0)" : `translateX(${hiddenX})`,
          transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: group.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: group.accent, flexShrink: 0,
          boxShadow: `0 4px 14px ${group.accent}30`,
        }}>
          {group.icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 24, color: "var(--navy)", fontFamily: "'Playfair Display', serif" }}>
            {group.category}
          </h3>
          <p style={{ margin: "4px 0 0", color: "var(--gray)", fontSize: 14 }}>
            {group.services.length} services available
          </p>
        </div>
        {/* decorative line */}
        <div style={{
          flex: 1, height: 2,
          background: `linear-gradient(${fromLeft ? "to right" : "to left"}, ${group.accent}40, transparent)`,
          marginLeft: 16,
        }} />
      </div>

      {/* ── Cards grid ── */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(265px, 1fr))",
          gap: 22,
        }}
      >
        {group.services.map((svc, idx) => (
          <ServiceCard
            key={svc.name}
            svc={svc}
            group={group}
            idx={idx}
            parentVisible={gridVisible}
            fromLeft={fromLeft}
            hiddenX={hiddenX}
          />
        ))}
      </div>
    </div>
  );
}

// ── Individual card with its own staggered animation ─────────────────────
function ServiceCard({ svc, group, idx, parentVisible, fromLeft, hiddenX }) {
  const delay = idx * 70;

  return (
    <div
      className="specialty-card"
      style={{
        opacity:   parentVisible ? 1 : 0,
        transform: parentVisible ? "translateX(0) translateY(0)" : `translateX(${hiddenX}) translateY(20px)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)`,
        transitionDelay: `${delay}ms`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderTop: `3px solid ${group.accent}`,
        borderLeft: fromLeft  ? `3px solid ${group.accent}20` : "none",
        borderRight: !fromLeft ? `3px solid ${group.accent}20` : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          fontSize: 28, lineHeight: 1,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
        }}>
          {svc.icon}
        </span>
        <h4 style={{ margin: 0, fontSize: 16, color: "var(--navy)", fontWeight: 700 }}>
          {svc.name}
        </h4>
      </div>
      <p style={{ margin: 0, color: "var(--gray)", fontSize: 14, lineHeight: 1.65 }}>
        {svc.desc}
      </p>
      <div style={{ marginTop: "auto", paddingTop: 10 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          color: group.accent, fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill={group.accent}>
            <circle cx="4" cy="4" r="4" />
          </svg>
          Available
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function OurService() {
  const heroRef  = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener for hero
  const onScroll = useCallback(() => setScrollY(window.scrollY), []);
  useEffect(() => {
    document.title = "Our Services | Dr. Thennarasu Clinic";
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Hero parallax offset: background moves at 40% of scroll speed
  const parallaxOffset = scrollY * 0.4;

  return (
    <div>
      {/* ── Hero with parallax ── */}
      <section
        ref={heroRef}
        style={{
          backgroundImage: `linear-gradient(rgba(7,20,50,0.60), rgba(7,20,50,0.60)), url(${ServiceImage})`,
          minHeight: "82vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          color: "#fff",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",           // CSS parallax
          backgroundPosition: `center ${parallaxOffset}px`,
          willChange: "background-position",
          overflow: "hidden",
        }}
      >
        {/* Hero content fades up from scroll zero */}
        <div style={{
          maxWidth: 720,
          transform: `translateY(${scrollY * 0.15}px)`,
          opacity: Math.max(0, 1 - scrollY / 420),
          transition: "none",
        }}>
          <span className="hero-badge">Our Services</span>
          <h1 style={{ marginTop: 24, fontSize: "clamp(2rem,5vw,3.2rem)", lineHeight: 1.1 }}>
            Comprehensive care for every stage of life.
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, color: "rgba(255,255,255,0.88)", lineHeight: 1.7 }}>
            From dental implants to chronic disease management — a full spectrum of speciality treatments under one roof.
          </p>
          <div className="hero-buttons" style={{ justifyContent: "center", gap: 16, marginTop: 32 }}>
            <Link to="/book" className="btn-primary">Book an Appointment</Link>
            <Link to="/pricing" className="btn-outline" style={{ color: "#fff" }}>View Pricing</Link>
          </div>
        </div>
      </section>

      {/* ── Services section ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-header" style={{ marginBottom: 64 }}>
          <h2>All Our Services</h2>
          <p>Browse our complete range of medical and dental specialities offered at Dr. Thennarasu Multispeciality Clinic.</p>
        </div>

        {SERVICE_GROUPS.map((group, gi) => (
          <ServiceGroup key={group.category} group={group} gi={gi} />
        ))}

        {/* ── CTA banner ── */}
        <div style={{
          marginTop: 16,
          background: "linear-gradient(135deg, var(--navy) 0%, #2d4a8a 100%)",
          borderRadius: 20,
          padding: "52px 36px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(26,39,68,0.12)",
        }}>
          <h3 style={{ fontSize: 28, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>
            Ready to get the care you deserve?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.78)", marginBottom: 28, fontSize: 16 }}>
            Book your appointment today — no login required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/book" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              📅 Book an Appointment
            </Link>
            <Link to="/pricing" style={{
              border: "2px solid rgba(255,255,255,0.4)", color: "#fff",
              padding: "14px 32px", borderRadius: 8, fontWeight: 600,
              fontSize: 16, textDecoration: "none",
              transition: "background 0.2s ease",
            }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
