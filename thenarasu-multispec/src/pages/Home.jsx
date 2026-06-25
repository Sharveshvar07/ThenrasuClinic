import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpecialities } from "../api";
import HeroBg from "../Images/homebg.jpg";
import SpecialtyIcon from "../components/SpecialtyIcon";

export default function Home() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Home | Dr. Thennarasu Clinic";

    getSpecialities()
      .then((res) => setSpecialities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          minHeight: "100vh",
          backgroundImage: `linear-gradient(rgba(7,20,50,0.65), rgba(7,20,50,0.65)), url(${HeroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "12px 22px",
              border: "1px solid #d4af37",
              borderRadius: "30px",
              color: "#d4af37",
              fontWeight: "600",
              marginBottom: "25px",
            }}
          >
            Caring across Generations
          </span>

          <h1
            style={{
              fontSize: "5rem",
              lineHeight: "1.1",
              fontWeight: "700",
              marginBottom: "25px",
              fontFamily: "Georgia, serif",
            }}
          >
            Healthcare that
            <br />
            feels like home.
          </h1>

          <p
            style={{
              fontSize: "1.5rem",
              color: "#f1f1f1",
              marginBottom: "15px",
            }}
          >
            Professional, compassionate multispeciality care for you and your family.
          </p>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#f1f1f1",
              marginBottom: "40px",
            }}
          >
            Experience a clinic where you immediately feel safe and understood.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/book"
              style={{
                backgroundColor: "#c9a227",
                color: "#0f172a",
                textDecoration: "none",
                padding: "20px 35px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              Book an Appointment
            </Link>

            <a
              href="#specialities"
              style={{
                textDecoration: "none",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                padding: "20px 35px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* SPECIALITIES */}
      <section
        id="specialities"
        style={{
          padding: "80px 5%",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "10px",
            }}
          >
            Our Specialised Care
          </h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Comprehensive health services tailored to meet the needs of every generation.
          </p>
        </div>

        {loading ? (
          <h3 style={{ textAlign: "center" }}>Loading...</h3>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "25px",
            }}
          >
           {specialities.map((s) => (
  <div
    key={s.id}
    style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    }}
  >
    {/* ✅ CHANGED: was {s.icon?.[0]}, now shows proper SVG icon */}
    <SpecialtyIcon name={s.name} />

    <h3>{s.name}</h3>
    <p>{s.description}</p>

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      <span>{s.doctorName}</span>
      <Link
        to={`/book?specialty=${s.id}`}
        style={{ textDecoration: "none", color: "#2563eb", fontWeight: "600" }}
      >
        Book →
      </Link>
    </div>
  </div>
))}
            
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          background: "#1c2f5c",
          color: "#fff",
          textAlign: "center",
          padding: "100px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px",
          }}
        >
          Ready to prioritize your health?
        </h2>

        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
          }}
        >
          Booking is simple and quick. Our team is ready to provide you the best care.
        </p>

        <Link
          to="/book"
          style={{
            background: "#fff",
            color: "#2563eb",
            textDecoration: "none",
            padding: "18px 35px",
            borderRadius: "12px",
            fontWeight: "700",
          }}
        >
          Schedule Visit Now
        </Link>
      </section>
    </div>
  );
}