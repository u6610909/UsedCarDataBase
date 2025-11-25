import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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

          <button style={styles.contactBtn}>Contact Seller</button>
        </div>
      </div>
    </div>
  );
}

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
};
