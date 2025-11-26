import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:4000/api/seller/${user.user_id}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome, {user.name} 👋</h1>
        <h2 style={styles.subtitle}>Your Seller Dashboard</h2>

        <div style={styles.cardRow}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Listings</h3>
            <p style={styles.cardValue}>{stats.total}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Approved</h3>
            <p style={styles.cardValue}>{stats.approved}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Pending</h3>
            <p style={styles.cardValue}>{stats.pending}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Rejected</h3>
            <p style={styles.cardValue}>{stats.rejected}</p>
          </div>
        </div>

        <div style={styles.btnRow}>
          <button style={styles.button} onClick={() => navigate("/seller/listings")}>
            Manage My Listings
          </button>

          <button style={styles.button} onClick={() => navigate("/seller/listings/new")}>
            Create New Listing
          </button>
          <button style={styles.inquiryButton} onClick={() => navigate("/seller/inquiries")}>
            View Buyer Inquiries
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- FULL SCREEN BLUE THEME ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#e0edff", // ฟ้าเต็มจอ
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "1280px", // กว้างสุดแบบโปร
    padding: "40px",
  },

  title: {
    fontSize: "52px",
    marginBottom: "10px",
    color: "#0d47a1",
  },

  subtitle: {
    fontSize: "26px",
    color: "#1565c0",
    marginBottom: "35px",
  },

  cardRow: {
    display: "flex",
    gap: "25px",
    marginBottom: "35px",
    flexWrap: "wrap",
    justifyContent: "space-between", // กระจาย card เต็มแนว
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    flex: "1",
    minWidth: "220px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: "20px",
    color: "#1565c0",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "44px",
    fontWeight: "bold",
    color: "#0d47a1",
  },

  btnRow: {
    display: "flex",
    gap: "20px",
  },

  button: {
    padding: "14px 26px",
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "0.2s",
  },

    inquiryButton: {
  padding: "14px 26px",
  background: "#1e88e5",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  cursor: "pointer",
  transition: "0.2s",
},
  loading: {
    padding: "40px",
    fontSize: "24px",
  
  },
};
