import { useState } from "react";
import "./../css/login.css";

export default function PatientLogin() {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const handleSubmit=(e)=>{
e.preventDefault();

if(email==="patient@gmail.com" && password==="123456"){
alert("Patient Login Successful");
}
else{
alert("Invalid Credentials");
}

}

return(

<div className="login-container">

<form className="login-form" onSubmit={handleSubmit}>

<h2>Patient Login</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button>Login</button>

</form>

</div>

)

}

import { useState } from "react";

export default function PatientLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (email === "patient@gmail.com" && password === "123456") {
      alert("Patient Login Successful");
    } else {
      alert("Invalid Patient Credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f8ff",
      }}
    >
      <form
        onSubmit={login}
        style={{
          width: "400px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,.15)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0d6efd" }}>
          Patient Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "15px 0",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}