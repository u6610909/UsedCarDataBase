import { useEffect, useState } from "react";

export default function BuyerListings() {
  const [listings, setListings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:4000/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err));
  }, []);

  const sendInquiry = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "buyer") {
      setStatusMsg("Please login as buyer to send inquiries.");
      return;
    }
    if (!selectedId) {
      setStatusMsg("Please select a car first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: user.user_id,
          listing_id: selectedId,
          message,
        }),
      });

      if (!res.ok) {
        setStatusMsg("Error sending inquiry.");
        return;
      }

      await res.json();
      setStatusMsg("Inquiry sent successfully!");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatusMsg("Error sending inquiry.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Browse Cars</h1>
        <p style={styles.subtitle}>
          All approved listings. Click "Contact Seller" to send an inquiry.
        </p>

        <div style={styles.cardGrid}>
          {listings.map((l) => (
            <div
              key={l.listing_id}
              style={{
                ...styles.card,
                border:
                  selectedId === l.listing_id ? "2px solid #1e88e5" : "1px solid #ddd",
              }}
            >
              <h3 style={styles.cardTitle}>{l.title}</h3>
              <p style={styles.cardLine}>
                <strong>{l.brand}</strong> {l.model} ({l.year})
              </p>
              <p style={styles.cardLine}>Mileage: {l.mileage} km</p>
              <p style={styles.price}>{l.price} THB</p>
              <p style={styles.cardLine}>Seller: {l.seller_name}</p>

              <button
                style={styles.primaryBtn}
                onClick={() => setSelectedId(l.listing_id)}
              >
                Contact Seller
              </button>
            </div>
          ))}
        </div>

        <div style={styles.inquiryBox}>
          <h2>Send Inquiry</h2>
          <p>Selected listing ID: {selectedId || "-"}</p>
          <form onSubmit={sendInquiry}>
            <textarea
              style={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to seller..."
            />
            <button type="submit" style={styles.primaryBtn}>
              Send Inquiry
            </button>
          </form>
          <p>{statusMsg}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e0edff",
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
    fontSize: "36px",
    color: "#0d47a1",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#1565c0",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    width: "260px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "6px",
    color: "#0d47a1",
  },
  cardLine: {
    margin: "2px 0",
    fontSize: "14px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1e88e5",
    margin: "8px 0",
  },
  primaryBtn: {
    padding: "8px 14px",
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
  },
  inquiryBox: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
};
