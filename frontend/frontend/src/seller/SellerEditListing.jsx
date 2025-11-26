import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SellerEditListing() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/api/seller/listings/item/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          brand: data.brand,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          description: data.description,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:4000/api/seller/listings/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => navigate("/seller/listings"))
      .catch((err) => console.error(err));
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px", background: "#e8f1ff", minHeight: "100vh" }}>
      <h1>Edit Listing</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" style={styles.input} />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" style={styles.input} />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model" style={styles.input} />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year" style={styles.input} />
        <input name="mileage" value={form.mileage} onChange={handleChange} placeholder="Mileage" style={styles.input} />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" style={styles.input} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ ...styles.input, height: "120px" }} />
        <button style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #aac",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
  },
};