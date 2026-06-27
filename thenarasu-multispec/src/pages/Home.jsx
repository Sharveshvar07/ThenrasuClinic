import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpecialities } from "../api";
import HeroBg from "../Images/homebg.jpg";
import Profile1 from "../Images/profile.jpeg";
import Profile2 from "../Images/Thennarasu prof.jpeg";
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
        style={{
          padding: "80px 5%",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {[
            {
              src: Profile1,
              name: "Dr. A.R. Thennarasu",
              title: "Consultant - Cranio Maxillofacial Surgery",
              degree: "MDS, OMFS",
              fellowship: "Fellowship in Cleft and Craniofacial Surgery",
              regNo: "29716",
              mobile: "+91 90926 63216",
              email: "a.rthennarasu05@gmail.com",
            },
            {
              src: Profile2,
              name: "Dr. A.R. Thennarasu",
              title: "Consultant - Cranio Maxillofacial Surgery",
              degree: "MDS, OMFS",
              fellowship: "Fellowship in Cleft and Craniofacial Surgery",
              regNo: "29716",
              mobile: "+91 90926 63216",
              email: "a.rthennarasu05@gmail.com",
            },
          ].map((profile, index) => (
            <div
              key={index}
              className="profile-card"
              style={{
                width: "100%",
                maxWidth: "360px",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(15,23,42,0.12)",
                position: "relative",
                background: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={profile.src}
                  alt={profile.name}
                  style={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ padding: "24px 22px" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{profile.title}</p>
                <h3 style={{ margin: "10px 0 0", fontSize: "1.5rem", color: "#0f172a" }}>{profile.name}</h3>
                <p style={{ margin: "10px 8px 0", color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>
                  {profile.degree}
                  <br />
                  {profile.fellowship}
                </p>
                <div style={{ marginTop: "18px", color: "#475569", fontSize: "14px", lineHeight: 1.8 }}>
                  <p style={{ margin: "0 0 8px" }}><strong>Reg No:</strong> {profile.regNo}</p>
                  <p style={{ margin: "0 0 8px" }}><strong>Mobile:</strong> {profile.mobile}</p>
                  <p style={{ margin: 0 }}><strong>Email:</strong> {profile.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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