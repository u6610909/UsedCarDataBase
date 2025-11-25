import { useEffect, useState } from "react";


export default function AdminPendingListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  if (!user || user.role !== "admin") {
    setTimeout(() => setLoading(false), 0);
    return;
  }

  fetch("http://localhost:4000/api/admin/pending-listings")
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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/admin/listings/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        alert("Error updating status");
        return;
      }

      setListings((prev) => prev.filter((l) => l.listing_id !== id));
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>Please login as admin.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>Loading pending listings...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin – Pending Listings</h1>
        <p style={styles.subtitle}>
          Review new car listings and approve or reject them.
        </p>

        {listings.length === 0 ? (
          <p>No pending listings.</p>
        ) : (
          <div style={styles.cardGrid}>
            {listings.map((l) => (
              <div key={l.listing_id} style={styles.card}>
                <h3 style={styles.cardTitle}>
                  [{l.listing_id}] {l.title}
                </h3>
                <p style={styles.cardLine}>
                  {l.brand} {l.model} ({l.year})
                </p>
                <p style={styles.cardLine}>Price: {l.price} THB</p>
                <p style={styles.cardLine}>Seller: {l.seller_name}</p>
                <p style={styles.cardLine}>Status: {l.status}</p>

                <div style={{ marginTop: "10px" }}>
                  <button
                    style={styles.approveBtn}
                    onClick={() => updateStatus(l.listing_id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => updateStatus(l.listing_id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff7e0",
    padding: "40px 0",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    padding: "0 40px",
  },
  title: {
    fontSize: "36px",
    color: "#b36b00",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#cc8a22",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "6px",
  },
  cardLine: {
    margin: "2px 0",
    fontSize: "14px",
  },
  approveBtn: {
    padding: "8px 14px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "8px",
  },
  rejectBtn: {
    padding: "8px 14px",
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
