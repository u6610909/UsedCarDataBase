import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return setMsg(data.message);

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "seller") navigate("/seller/dashboard");
    if (data.role === "buyer") navigate("/buyer/dashboard");
    if (data.role === "admin") navigate("/admin");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label><br/>
        <input 
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/><br/>

        <label>Password</label><br/>
        <input 
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/><br/>

        <button type="submit">Login</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
