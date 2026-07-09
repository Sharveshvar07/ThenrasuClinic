import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HeroBg from "../Images/homebg.jpg";
import Thennarasu from "../Images/Thennarasu prof.jpeg";
import Kavipriya from "../Images/kavipriya prof.jpeg";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [doctorsVisible, setDoctorsVisible] = useState(false);
  const doctorsRef = useRef(null);

  useEffect(() => {
    document.title = "Home | Dr. Thennarasu Clinic";
    setLoading(false);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDoctorsVisible(true);
      }
    }, { threshold: 0.1 });

    if (doctorsRef.current) observer.observe(doctorsRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(7,20,50,0.65), rgba(7,20,50,0.65)), url(${HeroBg})`,
          backgroundSize: "cover",
          backgroundPosition: `center ${scrollY * 0.5}px`,
          minHeight: "100vh",
        }}
      >
        <div className="hero-content">
          <span className="hero-badge">Caring across Generations</span>

          <h1>
            Healthcare that
            <br />
            feels like home.
          </h1>

          <p>
            Professional, compassionate multispeciality care for you and your family.
          </p>

          <p>
            Experience a clinic where you immediately feel safe and understood.
          </p>

          <div className="hero-buttons">
            <Link to="/book" className="btn-primary">
              Book an Appointment
            </Link>

            <Link to="/services" className="btn-outline">
              Our Services
            </Link>
          </div>
        </div>
      </section>

      <section ref={doctorsRef} className="doctors-section" id="doctors">
        <div className="section-header">
          <h2>Our Doctors</h2>
          <p>Experienced specialists dedicated to your care.</p>
        </div>

        <div className="doctors-grid" style={{ overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>Loading doctors...</div>
          ) : (
            [
              {
                id: 1,
                img: Kavipriya,
                name: 'Dr. Kavipriya',
                title: 'Consultant - General Medicine',
                qualification: 'MBBS,DNB (Family medicine)',
                regNo: '172183',
                mobile: '+91 90926 63216',
                email: 'a.rthennarasu05@gmail.com'
              },
              {
                id: 2,
                img: Thennarasu,
                name: 'Dr. A.R. Thennarasu',
                title: 'Consultant - Dental',
                degree: 'MDS., (OMFS)',
                fellowship: 'Fellowship in cleft and Craniofacial Surgery',
                regNo: '29716',
                mobile: '+91 90926 63216',
                email: 'a.rthennarasu05@gmail.com'
              },
            ].map((doc, idx) => (
              <div
                key={doc.id}
                className="profile-card"
                style={{
                  opacity: doctorsVisible ? 1 : 0,
                  transform: doctorsVisible ? "translateY(0)" : "translateY(25px)",
                  transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${idx * 200}ms`
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: 12 }}>
                  <img src={doc.img} alt={doc.name} style={{ width: '100%', height: 350, objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: 18 }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{doc.title}</p>
                  <h3 style={{ margin: '8px 0 4px' }}>{doc.name}</h3>
                  {doc.qualification ? (
                    <p style={{ margin: '4px 0 0', color: '#0f172a', fontWeight: 600 }}>{doc.qualification}</p>
                  ) : (
                    <div style={{ margin: '4px 0 0' }}>
                      <p style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>{doc.degree}</p>
                      {doc.fellowship && (
                        <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 13 }}>{doc.fellowship}</p>
                      )}
                    </div>
                  )}
                  <div style={{ marginTop: 12, color: '#475569', fontSize: 14 }}>
                    {doc.regNo && (
                      <p style={{ margin: '0 0 6px' }}><strong>Reg No:</strong> {doc.regNo}</p>
                    )}
                    {doc.mobile && (
                      <p style={{ margin: '0 0 6px' }}><strong>Phone:</strong> {doc.mobile}</p>
                    )}
                    {doc.email && (
                      <p style={{ margin: 0 }}><strong>Email:</strong> {doc.email}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
