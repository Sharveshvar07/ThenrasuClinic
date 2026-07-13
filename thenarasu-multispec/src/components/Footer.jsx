import { Link } from "react-router-dom";
import "../clinic.css"; 
import LocationQr from "../Images/locationqr.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Dr. Thennarasu Clinic</h3>
          <p>A warm, trustworthy multispeciality clinic providing comprehensive healthcare for families.</p>
          <em>"Caring across Generations."</em>
        </div>
        <div className="footer-contact">
          <div className="footer-contact-details">
            <h4>Contact Us</h4>
            <address>
              <p>
                <a
                  href="https://maps.app.goo.gl/eWcxcj7ASZQJ5ALq5"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fff", textDecoration: "underline" }}
                >
                  7G7M+R4M Uthangarai, Krishnagiri, TamilNadu
                </a>
              </p>
              <p>Phone: +91 8300288588 / +91 8300288788</p>
              <p>Email: a.rthennarasu05@gmail.com</p>
            </address>
          </div>
          <div className="footer-qr">
            <img
              src={LocationQr}
              alt="Location QR Code"
              className="footer-qr-image"
            />
          </div>
        </div>
      </div>
      <div className="footer-links">
        <Link to="/privacy">Privacy</Link>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Dr. Thennarasu Multispeciality Clinic. All rights reserved.
      </div>
    </footer>
  );
}