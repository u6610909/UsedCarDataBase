import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inquiry modal states
  const [showInquiry, setShowInquiry] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:4000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const sendInquiry = () => {
    if (!user) {
      alert("Please login as a buyer first.");
      return;
    }

    fetch("http://localhost:4000/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer_id: user.user_id,
        listing_id: car.listing_id,
        message: message,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Message sent to seller!");
        setShowInquiry(false);
        setMessage("");
      })
      .catch(() => alert("Failed to send message."));
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!car) {
    return <div style={styles.loading}>Car not found.</div>;
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate("/buyer")}>
        ⬅ Back
      </button>

      <div style={styles.layout}>
        {/* Car Image */}
        <div style={styles.left}>
          <img
            src={`/car${car.listing_id}.jpg`}
            alt={car.title}
            style={styles.bigImg}
          />

          <div style={styles.infoBox}>
            <h2 style={styles.price}>{car.price.toLocaleString()} THB</h2>
            <p style={styles.desc}>{car.description}</p>
          </div>
        </div>

        {/* Car Info */}
        <div style={styles.right}>
          <h1 style={styles.title}>
            {car.brand} {car.model}
          </h1>
          <p style={styles.year}>Year: {car.year}</p>
          <p style={styles.detail}>Mileage: {car.mileage} km</p>

          <h3 style={styles.sellerTitle}>👤 Seller Information</h3>
          <p style={styles.detail}>Name: {car.seller_name}</p>

          <button
            style={styles.contactBtn}
            onClick={() => setShowInquiry(true)}
          >
            Contact Seller
          </button>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Send Inquiry to Seller</h2>

            <textarea
              style={styles.textarea}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div style={styles.modalButtons}>
              <button style={styles.sendBtn} onClick={sendInquiry}>
                Send
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowInquiry(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------- STYLES ----------- */

const styles = {
  page: {
    padding: "40px",
    background: "#e8f1ff",
    minHeight: "100vh",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    fontSize: "22px",
  },
  backBtn: {
    padding: "10px 16px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  layout: {
    display: "flex",
    gap: "35px",
  },
  left: {
    flex: 1.2,
  },
  right: {
    flex: 1,
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  bigImg: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  infoBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  price: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a4fa3",
  },
  desc: {
    marginTop: "10px",
    color: "#555",
  },
  title: {
    fontSize: "32px",
    color: "#1a4fa3",
  },
  year: {
    fontSize: "18px",
    marginTop: "10px",
    color: "#444",
  },
  detail: {
    marginTop: "6px",
    color: "#444",
  },
  sellerTitle: {
    marginTop: "20px",
    fontWeight: "600",
    color: "#1a4fa3",
  },
  contactBtn: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  /* Modal Styles */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  modalButtons: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  sendBtn: {
    background: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#aaa",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};