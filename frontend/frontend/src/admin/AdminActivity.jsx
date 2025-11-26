import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/activity")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <Link to="/admin/accounts" style={styles.navItem}>
          ACCOUNTS
        </Link>
        <Link to="/admin/pending" style={styles.navItem}>
          APPROVE
        </Link>
        <span style={styles.navItemActive}>ACTIVITY</span>
      </div>

      {/* Back Button */}
      <Link to="/admin/accounts" style={styles.backBtn}>
        ← Back to Accounts
      </Link>

      <h1 style={styles.header}>ACTIVITY LOG</h1>

      {logs.length === 0 ? (
        <p>No activity records.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} style={styles.card}>
            <div style={styles.row}>
              <b>ID</b>: {log.user_id}
            </div>
            <div style={styles.row}>
              <b>Name</b>: {log.user_name}
            </div>
            <div style={styles.row}>
              <b>Activity</b>: {log.action}
            </div>
            <div style={styles.date}>
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    padding: "35px",
    background: "#eef3ff",
    minHeight: "100vh",
  },

  navbar: {
    display: "flex",
    gap: "25px",
    background: "#dae3fa",
    padding: "12px 24px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  navItem: {
    textDecoration: "none",
    color: "#44516b",
    fontSize: "17px",
    fontWeight: 500,
  },
  navItemActive: {
    textDecoration: "none",
    color: "#1b2f67",
    fontWeight: 700,
    borderBottom: "3px solid #1b2f67",
    paddingBottom: "4px",
    fontSize: "17px",
  },

  backBtn: {
    display: "inline-block",
    marginTop: "10px",
    marginBottom: "20px",
    textDecoration: "none",
    color: "#1b45d6",
    fontSize: "16px",
    fontWeight: 500,
  },

  header: {
    fontSize: "34px",
    color: "#1a2f6b",
    marginBottom: "25px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  },

  row: {
    marginBottom: "6px",
    fontSize: "18px",
  },

  date: {
    marginTop: "8px",
    color: "#666",
    fontSize: "14px",
  },
};