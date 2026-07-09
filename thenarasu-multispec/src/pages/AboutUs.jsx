import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import ClinicBg from "../Images/clinic.jpeg";

const values = [
  {
    icon: "🏥",
    title: "Patient-Centred Care",
    desc: "Every decision we make puts the patient's well-being first. We listen, understand, and act.",
  },
  {
    icon: "🔬",
    title: "Clinical Excellence",
    desc: "Our specialists stay at the forefront of medicine so you receive the most effective treatments available.",
  },
  {
    icon: "🤝",
    title: "Compassion & Trust",
    desc: "We treat every patient like family — with warmth, respect, and unwavering honesty.",
  },
  {
    icon: "🌟",
    title: "Continuous Improvement",
    desc: "We invest in the latest technology and training to keep raising the bar on quality care.",
  },
];



const doctors = [
  {
    id: 1,
    icon: "👩‍⚕️",
    name: "Dr. Kavipriya",
    title: "Consultant – General Medicine",
    qualification: "MBBS, DNB (Family Medicine)",
    regNo: "172183",
    experience: "10+ years",
    bio: "Dr. Kavipriya brings a compassionate, holistic approach to primary care. Her expertise ensures personalised care for patients of all ages.",
    specialities: ["General Medicine", "Family Health", "Preventive Care", "Internal Medicine", "Chronic Disease Management"],
  },
  {
    id: 2,
    icon: "🦷",
    name: "Dr. A.R. Thennarasu",
    title: "Consultant – Dental",
    qualification: "MDS (OMFS), Fellowship in Cleft & Craniofacial Surgery",
    regNo: "29716",
    experience: "15+ years",
    bio: "Dr. Thennarasu is a highly skilled oral and maxillofacial surgeon with extensive experience in complex reconstructive and cleft surgeries.",
    specialities: ["Oral & Maxillofacial Surgery", "Cleft Surgery", "Craniofacial Surgery", "Dental Implants", "Jaw Reconstruction"],
  },
];

const TOTAL_SLIDES = 5;
const AUTO_INTERVAL = 3500; // ms between slides

export default function AboutUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoRef = useRef(null);

  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const doctorsRef = useRef(null);
  const [missionVisible, setMissionVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [doctorsVisible, setDoctorsVisible] = useState(false);

  // ── Auto-advance carousel ──────────────────────────────────────────────
  const advance = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  useEffect(() => {
    if (isHovered) {
      clearInterval(autoRef.current);
      return;
    }
    autoRef.current = setInterval(advance, AUTO_INTERVAL);
    return () => clearInterval(autoRef.current);
  }, [isHovered, advance]);

  useEffect(() => {
    document.title = "About Us | Dr. Thennarasu Clinic";
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === missionRef.current) {
            setMissionVisible(true);
          } else if (entry.target === valuesRef.current) {
            setValuesVisible(true);
          } else if (entry.target === doctorsRef.current) {
            setDoctorsVisible(true);
          }
        }
      });
    }, observerOptions);

    if (missionRef.current) observer.observe(missionRef.current);
    if (valuesRef.current) observer.observe(valuesRef.current);
    if (doctorsRef.current) observer.observe(doctorsRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(7,20,50,0.62), rgba(7,20,50,0.62)), url(${ClinicBg})`,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          color: "#fff",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundPosition: `center ${scrollY * 0.5}px`,
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <span className="hero-badge">About Us</span>
          <h1 style={{ marginTop: 24, fontSize: "clamp(2rem,5vw,3.2rem)", lineHeight: 1.1 }}>
            A clinic built on trust,<br />excellence &amp; compassion.
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, color: "rgba(255,255,255,0.88)", maxWidth: 580, margin: "20px auto 0" }}>
            For over a decade, Dr. Thennarasu Multispeciality Clinic has been a cornerstone of community healthcare — delivering expert, personalised medical care to thousands of families.
          </p>
          <div className="hero-buttons" style={{ justifyContent: "center", gap: 16, marginTop: 32 }}>
            <Link to="/book" className="btn-primary">Book an Appointment</Link>
            <Link to="/services" className="btn-outline" style={{ color: "#fff" }}>Our Services</Link>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ──────────────────────────────────────────────── */}
      <section ref={missionRef} style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header">
            <h2>Our Mission &amp; Vision</h2>
            <p>We exist to provide accessible, compassionate and world-class healthcare to every person who walks through our doors.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginTop: 48, overflow: "hidden" }}>
            {/* Mission */}
            <div
              style={{
                ...missionCard,
                opacity: missionVisible ? 1 : 0,
                transform: missionVisible ? "translateX(0)" : "translateX(60px)",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0ms"
              }}
            >
              <div style={iconCircle("#eef2ff", "#4f46e5")}>🎯</div>
              <h3 style={cardHeading}>Our Mission</h3>
              <p style={cardText}>
                To provide comprehensive, compassionate, and affordable medical and dental care with a focus on prevention, wellness, and lifelong health.
              </p>
            </div>
            {/* Vision */}
            <div
              style={{
                ...missionCard,
                opacity: missionVisible ? 1 : 0,
                transform: missionVisible ? "translateX(0)" : "translateX(60px)",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "150ms"
              }}
            >
              <div style={iconCircle("#fef9ec", "#d97706")}>🔭</div>
              <h3 style={cardHeading}>Our Vision</h3>
              <p style={cardText}>
                Healthy Families, Healthy Smiles, Healthier Communities.
              </p>
            </div>
            {/* Philosophy */}
            <div
              style={{
                ...missionCard,
                opacity: missionVisible ? 1 : 0,
                transform: missionVisible ? "translateX(0)" : "translateX(60px)",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "300ms"
              }}
            >
              <div style={iconCircle("#f0fdf4", "#16a34a")}>💚</div>
              <h3 style={cardHeading}>Our Philosophy</h3>
              <p style={cardText}>
                Healthcare should never feel impersonal. We combine clinical expertise with warmth to create an experience you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ───────────────────────────────────────────────────── */}
      <section ref={valuesRef} className="specialities-section" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header">
            <h2>What We Stand For</h2>
            <p>The values that guide every interaction, every diagnosis, and every treatment at our clinic.</p>
          </div>

          <div className="specialty-grid" style={{ marginTop: 48, overflow: "hidden" }}>
            {values.map((v, i) => (
              <div
                key={i}
                className="specialty-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  opacity: valuesVisible ? 1 : 0,
                  transform: valuesVisible ? "translateX(0)" : "translateX(60px)",
                  transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${i * 150}ms`
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#eef2ff", display: "grid", placeItems: "center", fontSize: 26 }}>
                  {v.icon}
                </div>
                <h3 style={{ margin: 0, color: "var(--navy)", fontSize: 18 }}>{v.title}</h3>
                <p style={{ margin: 0, color: "var(--gray)", fontSize: 14, lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTORS ───────────────────────────────────────────────────────── */}
      <section ref={doctorsRef} style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header">
            <h2>Meet Our Doctors</h2>
            <p>Experienced, dedicated specialists who are passionate about your health.</p>
          </div>

          <div className="doctors-grid" style={{ marginTop: 48 }}>
            {doctors.map((doc, idx) => (
              <div
                key={doc.id}
                className="specialty-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  opacity: doctorsVisible ? 1 : 0,
                  transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${idx * 200}ms`
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a2744, #2d4a8a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, flexShrink: 0
                  }}>
                    {doc.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, color: "var(--navy)" }}>{doc.name}</h3>
                    <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 700 }}>{doc.title}</span>
                  </div>
                </div>

                {/* Qualification & Experience */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <span style={infoBadge("#eef2ff", "#3730a3")}>{doc.qualification}</span>
                  <span style={infoBadge("#fef9ec", "#92400e")}>⏱ {doc.experience} experience</span>
                  <span style={infoBadge("#f0fdf4", "#166534")}>Reg No: {doc.regNo}</span>
                </div>

                {/* Bio */}
                <p style={{ margin: 0, color: "var(--gray)", fontSize: 14, lineHeight: 1.7 }}>{doc.bio}</p>

                {/* Specialities */}
                <div>
                  <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 13, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Areas of Expertise</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {doc.specialities.map((s, i) => (
                      <span key={i} style={specialityTag}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header">
            <h2>Why Choose Us?</h2>
            <p>Here's what sets Dr. Thennarasu Multispeciality Clinic apart from the rest.</p>
          </div>

          {/* Slider Viewport */}
          <div
            style={{
              maxWidth: 650,
              margin: "48px auto 0",
              overflow: "hidden",
              borderRadius: 24,
              boxShadow: "0 20px 40px rgba(26,39,68,0.06)",
              background: "#fff",
              border: "1px solid var(--border)",
              position: "relative",
              cursor: "default",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slide Track */}
            <div style={{
              display: "flex",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(-${currentSlide * 100}%)`,
            }}>
              {[
                {
                  icon: "👤",
                  title: "Personalized Care",
                  desc: "Every patient receives an individualized treatment plan tailored to their unique health needs and lifestyle. We treat you as a person, not a symptom.",
                  color: "#4f46e5",
                  bg: "#eef2ff",
                },
                {
                  icon: "🔬",
                  title: "Evidence Based Treatment",
                  desc: "Our doctors follow the latest clinical guidelines and medical research to ensure you receive the most effective, safest, and proven therapies available.",
                  color: "#0891b2",
                  bg: "#ecfeff",
                },
                {
                  icon: "🏠",
                  title: "Comprehensive Family Healthcare",
                  desc: "From newborns to seniors, we offer complete medical and dental care for every member of your family under one roof, simplifying your healthcare journey.",
                  color: "#16a34a",
                  bg: "#f0fdf4",
                },
                {
                  icon: "🦷",
                  title: "Advanced Oral & Facial Care",
                  desc: "Specialised expertise in oral surgery, modern dental care, and complex craniofacial procedures delivered using state-of-the-art clinical techniques.",
                  color: "#d97706",
                  bg: "#fef9ec",
                },
                {
                  icon: "💛",
                  title: "Compassionate & Patient Centred Approach",
                  desc: "We listen first. Every interaction is built on empathy, respect, transparent communication, and an unwavering commitment to your long-term well-being.",
                  color: "#dc2626",
                  bg: "#fff1f2",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    flexShrink: 0,
                    padding: "48px 40px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    boxSizing: "border-box"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: item.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: item.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0,
                    }}>
                      ✓
                    </div>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 22, color: "var(--navy)", fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--gray)", fontSize: 16, lineHeight: 1.75 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Navigation (Arrows and Dots) */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginTop: 32
          }}>
            <button
              onClick={() => { setCurrentSlide((prev) => (prev === 0 ? TOTAL_SLIDES - 1 : prev - 1)); clearInterval(autoRef.current); }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "#fff",
                color: "var(--navy)",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--navy)";
              }}
            >
              ←
            </button>

            {/* Dots + progress indicator */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentSlide(idx); clearInterval(autoRef.current); }}
                  style={{
                    position: "relative",
                    width: currentSlide === idx ? 32 : 10,
                    height: 10,
                    borderRadius: 999,
                    border: "none",
                    background: currentSlide === idx ? "var(--gold)" : "var(--border)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: 0,
                    overflow: "hidden",
                  }}
                >
                  {/* Animated fill bar on active dot */}
                  {currentSlide === idx && !isHovered && (
                    <span
                      style={{
                        position: "absolute",
                        top: 0, left: 0,
                        height: "100%",
                        width: "100%",
                        background: "rgba(255,255,255,0.45)",
                        borderRadius: 999,
                        animation: `dot-fill ${AUTO_INTERVAL}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setCurrentSlide((prev) => (prev === TOTAL_SLIDES - 1 ? 0 : prev + 1)); clearInterval(autoRef.current); }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "#fff",
                color: "var(--navy)",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--navy)";
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>


      {/* ── CTA ───────────────────────────────────────────────────────────── */}

      <section className="cta-section">
        <h2>Ready to experience exceptional care?</h2>
        <p>Book your appointment today and let our specialists take care of you.</p>
        <div className="hero-buttons" style={{ justifyContent: "center" }}>
          <Link to="/book" className="btn-primary">Book an Appointment</Link>
          <Link to="/services" className="btn-outline" style={{ color: "#fff" }}>Explore Services</Link>
        </div>
      </section>
    </div>
  );
}

/* ── inline style helpers ─────────────────────────────────────────────────── */
const missionCard = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: "32px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  transition: "transform .3s, box-shadow .3s",
};

const iconCircle = (bg, color) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  background: bg,
  color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 26,
});

const cardHeading = {
  margin: 0,
  fontSize: 20,
  color: "var(--navy)",
};

const cardText = {
  margin: 0,
  color: "var(--gray)",
  fontSize: 15,
  lineHeight: 1.7,
};

const infoBadge = (bg, color) => ({
  display: "inline-flex",
  alignItems: "center",
  background: bg,
  color,
  fontSize: 12,
  fontWeight: 700,
  padding: "5px 12px",
  borderRadius: 999,
});

const specialityTag = {
  background: "#eef2ff",
  color: "#3730a3",
  fontSize: 13,
  fontWeight: 600,
  padding: "6px 14px",
  borderRadius: 999,
  border: "1px solid #c7d2fe",
};

