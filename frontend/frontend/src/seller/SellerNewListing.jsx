import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerNewListing() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    description: "",
  });

  if (!user || user.role !== "seller") {
    return <div style={styles.page}>Please login as seller.</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: user.user_id,
          title: form.title,
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          mileage: Number(form.mileage),
          price: Number(form.price),
          description: form.description,
        }),
      });

      if (!res.ok) {
        alert("Error creating listing");
        return;
      }

      await res.json();
      navigate("/seller/listings");
    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Create New Listing</h1>
        <p style={styles.subtitle}>Fill in the details of the car you want to sell.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Brand</label>
          <input
            style={styles.input}
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Model</label>
          <input
            style={styles.input}
            name="model"
            value={form.model}
            onChange={handleChange}
          />

          <label style={styles.label}>Year</label>
          <input
            style={styles.input}
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
          />

          <label style={styles.label}>Mileage</label>
          <input
            style={styles.input}
            name="mileage"
            type="number"
            value={form.mileage}
            onChange={handleChange}
          />

          <label style={styles.label}>Price (THB)</label>
          <input
            style={styles.input}
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, height: "80px" }}
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <div style={{ marginTop: "20px" }}>
            <button type="submit" style={styles.primaryBtn}>
              Save Listing
            </button>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/seller/listings")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e0edff",
    display: "flex",
    justifyContent: "center",
    padding: "40px 0",
  },
  container: {
    width: "100%",
    maxWidth: "700px",
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
  form: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  label: {
    display: "block",
    marginBottom: "4px",
    marginTop: "12px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  secondaryBtn: {
    padding: "10px 18px",
    background: "#ffffff",
    color: "#1e88e5",
    border: "1px solid #1e88e5",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
