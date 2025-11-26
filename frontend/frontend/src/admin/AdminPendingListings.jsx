import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminPendingListings() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/pending-listings")
      .then((res) => res.json())
      .then((data) => setPending(data))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:4000/api/admin/listings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`Listing ${status}`);
        setPending(pending.filter((item) => item.listing_id !== id));
      })
      .catch(() => alert("Failed to update listing"));
  };

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <div style={styles.navbar}>
        <Link to="/admin/accounts" style={styles.navItem}>
          ACCOUNTS
        </Link>
        <Link to="/admin/pending" style={styles.navItemActive}>
          APPROVE
        </Link>
        <Link to="/admin/activity" style={styles.navItem}>
          ACTIVITY
        </Link>
      </div>

      {/* Back Button */}
      <Link to="/admin/accounts" style={styles.backBtn}>
        ← Back to Accounts
      </Link>

      <h1 style={styles.header}>PENDING LISTINGS</h1>

      {pending.length === 0 ? (
        <p style={{ marginTop: "15px" }}>No pending listings.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {pending.map((item) => (
            <div key={item.listing_id} style={styles.card}>
              <h3 style={styles.title}>{item.title}</h3>
              <p><b>Seller:</b> {item.seller_name}</p>
              <p><b>Brand:</b> {item.brand}</p>
              <p><b>Price:</b> {item.price.toLocaleString()} THB</p>

              <div style={styles.btnRow}>
                <button
                  style={styles.btnApprove}
                  onClick={() => updateStatus(item.listing_id, "approved")}
                >
                  Approve
                </button>

                <button
                  style={styles.btnReject}
                  onClick={() => updateStatus(item.listing_id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Styles ----------- */
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
    marginBottom: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  },

  title: {
    fontSize: "22px",
    marginBottom: "5px",
  },

  btnRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },

  btnApprove: {
    padding: "10px 18px",
    background: "#43a047",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  btnReject: {
    padding: "10px 18px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};