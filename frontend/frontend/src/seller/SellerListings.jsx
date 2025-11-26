import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/api/seller/${user.user_id}/listings`)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.headerArea}>
        <h1 style={styles.title}>My Listings</h1>
        <p style={styles.subtitle}>
          Manage all your cars in one place. You can edit, delete or add new listings.
        </p>

        <div style={styles.btnRow}>
          <button style={styles.addBtn} onClick={() => navigate("/seller/listings/new")}>
            + Create New Listing
          </button>
          <button style={styles.backBtn} onClick={() => navigate("/seller/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Brand</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Price (THB)</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {listings.map((car) => (
              <tr key={car.listing_id} style={styles.tr}>
                <td style={styles.td}>{car.title}</td>
                <td style={styles.td}>{car.brand}</td>
                <td style={styles.td}>{car.year}</td>
                <td style={styles.td}>{Number(car.price).toLocaleString()}</td>
                <td style={styles.status(car.status)}>{car.status}</td>

                <td style={styles.tdActions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/seller/listings/edit/${car.listing_id}`)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => navigate(`/seller/listings/delete/${car.listing_id}`)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e7f0ff",
    padding: "40px 60px",
  },

  headerArea: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "48px",
    color: "#0d47a1",
    marginBottom: "10px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#3a5ba0",
    fontSize: "20px",
    marginBottom: "25px",
  },

  btnRow: {
    display: "flex",
    gap: "20px",
  },

  addBtn: {
    padding: "14px 24px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "600",
  },

  backBtn: {
    padding: "14px 24px",
    background: "#dbe7ff",
    color: "#1a4fa3",
    border: "2px solid #a7c2f3",
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableWrapper: {
    marginTop: "20px",
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    fontSize: "18px",
    color: "#0d47a1",
    borderBottom: "2px solid #d3defa",
  },

  tr: {
    transition: "0.2s",
  },

  td: {
    padding: "14px",
    fontSize: "17px",
    borderBottom: "1px solid #eef3ff",
  },

  tdActions: {
    padding: "14px",
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    padding: "8px 18px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteBtn: {
    padding: "8px 18px",
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  status: (s) => ({
    padding: "10px 12px",
    borderRadius: "10px",
    textTransform: "capitalize",
    color: s === "approved" ? "#0d7a04" : s === "pending" ? "#b58900" : "#b00020",
    background:
      s === "approved"
        ? "#d4f8d2"
        : s === "pending"
        ? "#fff5c4"
        : "#ffd6d6",
    fontWeight: "600",
    textAlign: "center",
  }),

  loading: {
    padding: "50px",
    fontSize: "24px",
  },
};