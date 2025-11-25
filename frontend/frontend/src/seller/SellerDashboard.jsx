import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:4000/api/seller/${user.user_id}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome, {user.name} 👋</h1>
      <h2>Your Seller Dashboard</h2>

      <div style={{ marginTop: "20px" }}>
        <div style={cardBox}>
          <h3>Total Listings</h3>
          <p>{stats.total}</p>
        </div>

        <div style={cardBox}>
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>

        <div style={cardBox}>
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div style={cardBox}>
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      <button
        style={btn}
        onClick={() => navigate("/seller/listings")}
      >
        Manage My Listings
      </button>

      <button
        style={btn}
        onClick={() => navigate("/seller/listings/new")}
      >
        Create New Listing
      </button>
    </div>
  );
}

const cardBox = {
  display: "inline-block",
  marginRight: "20px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "180px",
  textAlign: "center",
  background: "#fff"
};

const btn = {
  marginTop: "20px",
  marginRight: "10px",
  padding: "10px 20px",
  background: "#2979ff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
