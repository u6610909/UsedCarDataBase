import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:4000/api/seller/${user.user_id}/listings`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error deleting listing");
        return;
      }

      setListings((prev) => prev.filter((l) => l.listing_id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting listing");
    }
  };

  if (!user) return <div style={styles.page}>Please login first.</div>;
  if (loading) return <div style={styles.page}>Loading listings...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Listings</h1>
        <p style={styles.subtitle}>
          Manage all your cars in one place. You can edit, delete or add new listings.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/seller/listings/new")}>
            + Create New Listing
          </button>
          <button
            style={{ ...styles.secondaryBtn, marginLeft: "10px" }}
            onClick={() => navigate("/seller/dashboard")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {listings.length === 0 ? (
          <p>You don’t have any listings yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thTd}>Title</th>
                <th style={styles.thTd}>Brand</th>
                <th style={styles.thTd}>Year</th>
                <th style={styles.thTd}>Price (THB)</th>
                <th style={styles.thTd}>Status</th>
                <th style={styles.thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.listing_id}>
                  <td style={styles.thTd}>{l.title}</td>
                  <td style={styles.thTd}>{l.brand}</td>
                  <td style={styles.thTd}>{l.year}</td>
                  <td style={styles.thTd}>{l.price}</td>
                  <td style={styles.thTd}>{l.status}</td>
                  <td style={styles.thTd}>
                    <button
                      style={styles.smallBtn}
                      onClick={() => navigate(`/seller/listings/edit/${l.listing_id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.smallDangerBtn}
                      onClick={() => handleDelete(l.listing_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e0edff",
    margin: 0,
    padding: "40px 0",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    padding: "0 40px",
  },
  title: {
    fontSize: "40px",
    color: "#0d47a1",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#1565c0",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  thTd: {
    borderBottom: "1px solid #eee",
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "14px",
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 18px",
    background: "#ffffff",
    color: "#1e88e5",
    border: "1px solid #1e88e5",
    borderRadius: "8px",
    cursor: "pointer",
  },
  smallBtn: {
    padding: "6px 10px",
    marginRight: "6px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
  smallDangerBtn: {
    padding: "6px 10px",
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
};
