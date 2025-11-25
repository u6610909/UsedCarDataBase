import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SellerEditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:4000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          brand: data.brand,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          description: data.description || "",
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        alert("Error updating listing");
        return;
      }

      await res.json();
      navigate("/seller/listings");
    } catch (err) {
      console.error(err);
      alert("Error updating listing");
    }
  };

  if (!form) {
    return <div style={styles.page}>Loading listing...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Listing</h1>
        <p style={styles.subtitle}>Update the details of your car listing.</p>

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
              Update Listing
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
  ...{ // reuse from NewListing
  },
};
