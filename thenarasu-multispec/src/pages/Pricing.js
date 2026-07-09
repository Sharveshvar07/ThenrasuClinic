import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import pricingBg from "../Images/pricingbg.jpeg";

const pricingCategories = [
  {
    specialty: "Family Medicine",
    icon: "🏥",
    color: "#EFF6FF",
    border: "#BFDBFE",
    headerBg: "#2563EB",
    items: [
      { treatment: "General Consultation",   price: "₹300",        note: "" },
      { treatment: "Follow-up Consultation", price: "₹150",        note: "" },
      { treatment: "Blood Pressure Check",   price: "₹100",        note: "" },
      { treatment: "Diabetes Screening",     price: "₹200",        note: "" },
      { treatment: "Full Health Check-up",   price: "₹999",        note: "Includes basic tests" },
    ],
  },
  {
    specialty: "Dental Care",
    icon: "🦷",
    color: "#F0FDFA",
    border: "#99F6E4",
    headerBg: "#0D9488",
    items: [
      { treatment: "Dental Consultation",         price: "₹200",          note: "" },
      { treatment: "Scaling & Polishing",         price: "₹800 – ₹1,500", note: "Per sitting" },
      { treatment: "Tooth Extraction (Simple)",   price: "₹500 – ₹800",   note: "" },
      { treatment: "Tooth Extraction (Surgical)", price: "₹1,500 – ₹2,500", note: "" },
      { treatment: "Root Canal Treatment",        price: "₹3,000 – ₹6,000", note: "Per tooth" },
      { treatment: "Tooth Filling (Composite)",   price: "₹800 – ₹1,500", note: "Per tooth" },
      { treatment: "Tooth Filling (GIC)",         price: "₹400 – ₹700",   note: "Per tooth" },
      { treatment: "Gum Treatment",               price: "₹500 – ₹2,000", note: "Depends on severity" },
    ],
  },
  {
    specialty: "Dental Implants",
    icon: "🔩",
    color: "#FAF5FF",
    border: "#E9D5FF",
    headerBg: "#7C3AED",
    items: [
      { treatment: "Single Implant (Basic)",   price: "₹18,000 – ₹22,000",  note: "Implant + crown" },
      { treatment: "Single Implant (Premium)", price: "₹25,000 – ₹35,000",  note: "Titanium, USA/Swiss brand" },
      { treatment: "Implant Consultation",     price: "₹300",                note: "Adjusted against treatment" },
      { treatment: "Full Mouth Implants",      price: "Contact for quote",   note: "" },
      { treatment: "Bone Grafting",            price: "₹8,000 – ₹15,000",   note: "If required" },
      { treatment: "Implant Crown (PFM)",      price: "₹3,500 – ₹5,000",    note: "" },
      { treatment: "Implant Crown (Zirconia)", price: "₹6,000 – ₹9,000",    note: "" },
    ],
  },
  {
    specialty: "Facial Care",
    icon: "✨",
    color: "#FFF1F2",
    border: "#FECDD3",
    headerBg: "#EC4899",
    items: [
      { treatment: "Facial Consultation",        price: "₹250",          note: "" },
      { treatment: "Basic Facial Clean-up",      price: "₹500 – ₹800",   note: "" },
      { treatment: "Advanced Facial",            price: "₹1,200 – ₹2,000", note: "" },
      { treatment: "Acne Treatment (per session)", price: "₹800 – ₹1,500", note: "" },
      { treatment: "Chemical Peel",              price: "₹1,500 – ₹3,000", note: "Per session" },
      { treatment: "Pigmentation Treatment",     price: "₹2,000 – ₹4,000", note: "Per session" },
      { treatment: "Anti-Ageing Treatment",      price: "₹3,000 – ₹6,000", note: "Per session" },
    ],
  },
  {
    specialty: "Preventive Care",
    icon: "🛡️",
    color: "#F0FDF4",
    border: "#BBF7D0",
    headerBg: "#16A34A",
    items: [
      { treatment: "Preventive Health Check (Basic)",    price: "₹799",   note: "CBC, Blood Sugar, BP" },
      { treatment: "Preventive Health Check (Advanced)", price: "₹1,999", note: "15+ tests included" },
      { treatment: "Annual Health Package",              price: "₹3,500", note: "Comprehensive screening" },
      { treatment: "Vaccination (Adult)",                price: "₹300 – ₹2,500", note: "Depends on vaccine" },
      { treatment: "ECG",                                price: "₹250",   note: "" },
      { treatment: "Cholesterol Screening",              price: "₹300",   note: "" },
      { treatment: "Thyroid Profile",                    price: "₹400",   note: "" },
    ],
  },
  {
    specialty: "Pediatric Care",
    icon: "👶",
    color: "#FFFBEB",
    border: "#FDE68A",
    headerBg: "#D97706",
    items: [
      { treatment: "Pediatric Consultation",      price: "₹300",          note: "" },
      { treatment: "Newborn Check-up",            price: "₹400",          note: "" },
      { treatment: "Growth & Development Check",  price: "₹350",          note: "" },
      { treatment: "Immunization (per dose)",     price: "₹200 – ₹1,500", note: "Depends on vaccine" },
      { treatment: "Child Nutrition Counselling", price: "₹300",          note: "" },
      { treatment: "Pediatric Follow-up",         price: "₹150",          note: "" },
    ],
  },
  {
    specialty: "Women's Health",
    icon: "👩‍⚕️",
    color: "#FFF1F2",
    border: "#FECDD3",
    headerBg: "#E11D48",
    items: [
      { treatment: "Gynaecology Consultation", price: "₹400",          note: "" },
      { treatment: "Pap Smear",                price: "₹500 – ₹800",   note: "" },
      { treatment: "Ultrasound (Obstetric)",   price: "₹700 – ₹1,200", note: "" },
      { treatment: "Antenatal Check-up",       price: "₹350",          note: "Per visit" },
      { treatment: "Women's Wellness Package", price: "₹1,999",        note: "Thyroid, CBC, Pap smear" },
      { treatment: "PCOD/PCOS Consultation",   price: "₹500",          note: "" },
      { treatment: "Menopause Management",     price: "₹500",          note: "" },
    ],
  },
  {
    specialty: "General Surgery",
    icon: "🏨",
    color: "#FFF7ED",
    border: "#FED7AA",
    headerBg: "#EA580C",
    items: [
      { treatment: "Surgical Consultation",        price: "₹400",          note: "" },
      { treatment: "Minor Surgery (Small lesion)", price: "₹1,500 – ₹3,000", note: "" },
      { treatment: "Cyst / Lipoma Removal",        price: "₹2,000 – ₹5,000", note: "Depends on size" },
      { treatment: "Wound Suturing",               price: "₹500 – ₹1,500",   note: "" },
      { treatment: "Abscess Drainage",             price: "₹1,000 – ₹2,000", note: "" },
      { treatment: "Ingrown Nail Surgery",         price: "₹1,500 – ₹2,500", note: "" },
    ],
  },
];

export default function Pricing() {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const cardsRef = useRef(null);

  useEffect(() => {
    document.title = "Pricing | Dr. Thennarasu Multispeciality Clinic";

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCardsVisible(true);
      }
    }, { threshold: 0.05 });

    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>

      {/* Hero */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(8, 30, 77, 0.72), rgba(11, 54, 120, 0.72)), url(${pricingBg})`,
        backgroundSize: "cover",
        backgroundPosition: `center ${scrollY * 0.5}px`,
        backgroundRepeat: "no-repeat",
        color: "#fff",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 16px",
        textAlign: "center",
      }}>
        
        <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "12px" }}>
          Treatment Pricing
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "17px", maxWidth: "560px", margin: "0 auto 24px" }}>
          Affordable, transparent pricing for all our specialties. No hidden charges — what you see is what you pay.
        </p>
      </section>


      {/* Pricing Cards */}
      <section ref={cardsRef} style={{ padding: "60px 16px", backgroundColor: "#f9fafb", overflow: "hidden" }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
          gap: "28px",
        }}>
          {pricingCategories.map((cat, idx) => (
            <div key={cat.specialty} style={{
              backgroundColor: cat.color,
              border: `2px solid ${cat.border}`,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              opacity: cardsVisible ? 1 : 0,
              transform: cardsVisible ? "translateX(0)" : "translateX(60px)",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: `${idx * 100}ms`
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: cat.headerBg,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <span style={{ fontSize: "24px" }}>{cat.icon}</span>
                <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "18px", margin: 0 }}>
                  {cat.specialty}
                </h2>
              </div>

              {/* Rows */}
              {cat.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 20px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "500", fontSize: "14px", color: "#1f2937" }}>
                      {item.treatment}
                    </p>
                    {item.note && (
                      <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                        {item.note}
                      </p>
                    )}
                  </div>
                  <span style={{
                    fontWeight: "700",
                    color: "#1a3c5e",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    marginLeft: "16px",
                  }}>
                    {item.price}
                  </span>
                </div>
              ))}

              {/* Book Button */}
              <div style={{ padding: "12px 20px", backgroundColor: "rgba(255,255,255,0.5)" }}>
                <Link to="/book" style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  color: "#1a3c5e",
                  fontWeight: "600",
                  fontSize: "13px",
                  textDecoration: "none",
                  backgroundColor: "#fff",
                }}>
                  Book {cat.specialty} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          maxWidth: "1100px",
          margin: "40px auto 0",
          backgroundColor: "#f3f4f6",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          fontSize: "13px",
          color: "#6b7280",
        }}>
          <p style={{ fontWeight: "700", color: "#374151", marginTop: 0 }}>📋 Important Notes</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>Prices are indicative and may vary based on individual case complexity.</li>
            <li>Final treatment cost will be communicated during consultation.</li>
            <li>Prices shown are inclusive of consultation charges unless stated otherwise.</li>
            <li>Government-approved health insurance accepted. Please carry your insurance card.</li>
            <li>For detailed quotes on major procedures, call <a href="tel:+919092663216" style={{ color: "#e8a020", fontWeight: "600" }}>+91 9092663216</a>.</li>
          </ul>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        backgroundColor: "#1a3c5e",
        color: "#fff",
        textAlign: "center",
        padding: "60px 16px",
      }}>
        <h2 style={{ fontSize: "30px", fontWeight: "800", marginBottom: "10px" }}>
          Ready to book your appointment?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", marginBottom: "24px" }}>
          Our team is ready to help you with any queries before you book.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/book" style={{
            backgroundColor: "#e8a020", color: "#fff",
            padding: "14px 32px", borderRadius: "8px",
            fontWeight: "700", fontSize: "15px", textDecoration: "none",
          }}>
            Book Now
          </Link>
          <a href="tel:+919092663216" style={{
            border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
            padding: "14px 32px", borderRadius: "8px",
            fontWeight: "600", fontSize: "15px", textDecoration: "none",
          }}>
            Call +91 9092663216
          </a>
        </div>
      </section>

    </div>
  );
}