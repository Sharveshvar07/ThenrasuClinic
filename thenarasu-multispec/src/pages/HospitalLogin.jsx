import { useState } from "react";
import "./../css/login.css";

export default function HospitalLogin(){

const [staffId,setStaffId]=useState("");
const [password,setPassword]=useState("");

const handleSubmit=(e)=>{
e.preventDefault();

if(staffId==="ADMIN001" && password==="admin123"){
alert("Hospital Login Successful");
}
else{
alert("Invalid Credentials");
}

}

return(

<div className="login-container">

<form className="login-form" onSubmit={handleSubmit}>

<h2>Hospital Login</h2>

<input
type="text"
placeholder="Staff ID"
value={staffId}
onChange={(e)=>setStaffId(e.target.value)}
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