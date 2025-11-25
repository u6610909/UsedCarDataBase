import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();          // กันไม่ให้ form refresh หน้า
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // data = { user_id, name, email, role }
      localStorage.setItem("user", JSON.stringify(data));

      // redirect ตาม role
      if (data.role === "admin") {
        navigate("/admin/pending");
      } else if (data.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        // buyer
        navigate("/buyer");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h1 style={styles.title}>Welcome to Autoconnect 👋</h1>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
          />
        </div>

        <button style={styles.loginBtn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#dceaff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    padding: "40px 40px 32px",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(15, 35, 90, 0.18)",
    textAlign: "center",
  },

  title: {
    fontSize: "34px",
    color: "#1a4fa3",
    fontWeight: "700",
  },

  subtitle: {
    color: "#5c7cb8",
    marginTop: "6px",
    marginBottom: "26px",
  },

  error: {
    background: "#ffe5e5",
    color: "#c62828",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "left",
  },

  inputGroup: {
    textAlign: "left",
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    color: "#1a4fa3",
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #a7c2f3",
    background: "#f8fbff",
    fontSize: "15px",
    outline: "none",
  },

  loginBtn: {
    marginTop: "18px",
    width: "100%",
    padding: "14px",
    background: "#2979ff",
    color: "white",
    border: "none",
    borderRadius: "999px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 16px rgba(41,121,255,0.35)",
  },
};
