import { Link } from "react-router-dom";
import "../clinic.css"; 

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Dr. Thennarasu Clinic</h3>
          <p>A warm, trustworthy multispeciality clinic providing comprehensive healthcare for families.</p>
          <em>"Caring across Generations."</em>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/book">Book Appointment</Link></li>
            <li><Link to="/appointments">My Appointments</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
          <address>
            <p><a href="https://maps.app.goo.gl/eWcxcj7ASZQJ5ALq5" target="_blank" rel="noopener noreferrer"
             style={{color: "#fff", textDecoration: "underline"}}>7G7M+R4M Uthangarai, Krishnagiri, TamilNadu</a></p>
          
            <p>Phone: 73730 12109</p>
            <p>Email: care@drthennarasu.com</p>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Dr. Thennarasu Multispeciality Clinic. All rights reserved.
      </div>
    </footer>
  );
}