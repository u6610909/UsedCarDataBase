import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerNewListing() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    description: ""
  });

  if (!user || user.role !== "seller") {
    return <h2>Please login as seller</h2>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/api/listings", {
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
        description: form.description
      })
    })
      .then(res => res.json())
      .then(() => {
        navigate("/seller/listings");
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Create New Listing</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Brand</label>
        <input
          style={inputStyle}
          name="brand"
          value={form.brand}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Model</label>
        <input
          style={inputStyle}
          name="model"
          value={form.model}
          onChange={handleChange}
        />

        <label style={labelStyle}>Year</label>
        <input
          style={inputStyle}
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
        />

        <label style={labelStyle}>Mileage</label>
        <input
          style={inputStyle}
          name="mileage"
          type="number"
          value={form.mileage}
          onChange={handleChange}
        />

        <label style={labelStyle}>Price</label>
        <input
          style={inputStyle}
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, height: "80px" }}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" style={submitBtn}>
          Save Listing
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: "block", marginTop: "10px", marginBottom: "4px" };
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};
const submitBtn = {
  marginTop: "16px",
  padding: "10px 20px",
  background: "#2979ff",
  border: "none",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer"
};
