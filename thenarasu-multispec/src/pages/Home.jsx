import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpecialities } from "../api";
import HeroBg from "../Images/homebg.jpg";
import Thennarasu from "../Images/Thennarasu prof.jpeg";
import Kavipriya from "../Images/kavipriya prof.jpeg";
import SpecialtyIcon from "../components/SpecialtyIcon";

export default function Home() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Home | Dr. Thennarasu Clinic";

    getSpecialities()
      .then((res) => {
        // Filter out "General Surgery" from the homepage
        const filtered = res.data.filter(s => s.name !== "General Surgery");
        setSpecialities(filtered);
      })
      .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(7,20,50,0.65), rgba(7,20,50,0.65)), url(${HeroBg})`,
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

            <a href="#specialities" className="btn-outline">
              Our Services
            </a>
          </div>
        </div>
      </section>

      <section className="doctors-section" id="doctors">
        <div className="section-header">
          <h2>Our Doctors</h2>
          <p>Experienced specialists dedicated to your care.</p>
        </div>

        <div className="doctors-grid">
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>Loading doctors...</div>
          ) : (
            [
              {
                id: 1,
                img: Kavipriya,
                name: 'Dr. Kavipriya',
                title: 'Consultant - Cranio Maxillofacial Surgery',
                qualification: 'MBBS,DNB (Family medicine)',
                regNo: '172183',
                mobile: '+91 90926 63216',
                email: 'a.rthennarasu05@gmail.com'
              },
              {
                id: 2,
                img: Thennarasu,
                name: 'Dr. A.R. Thennarasu',
                title: 'Consultant - Cranio Maxillofacial Surgery',
                degree: 'MDS., (OMFS)',
                fellowship: 'Fellowship in cleft and Craniofacial Surgery',
                regNo: '29716',
                mobile: '+91 90926 63216',
                email: 'a.rthennarasu05@gmail.com'
              },
            ].map((doc) => (
              <div key={doc.id} className="profile-card">
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

      <section className="specialities-section" id="specialities">
        <div className="section-header">
          <h2>Our Specialities</h2>
          <p>Choose from our list of medical specialities and experts.</p>
        </div>

        <div className="specialty-grid">
          {specialities && specialities.length > 0 ? (
            specialities.map((s) => (
              <div key={s._id} className="specialty-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ minWidth: 56 }}>
                    <SpecialtyIcon name={s.icon || s.name} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{s.name}</h3>
                    <p style={{ margin: '6px 0 0', color: 'var(--gray)' }}>{s.description}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <small style={{ color: s.available ? '#065f46' : '#991b1b', fontWeight: 700 }}>{s.available ? 'Available' : 'Not Available'}</small>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray)' }}>
              No specialities found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
