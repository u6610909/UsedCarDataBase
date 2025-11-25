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
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this listing?")) return;

    fetch(`http://localhost:4000/api/listings/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        setListings(listings.filter(l => l.listing_id !== id));
      })
      .catch(err => console.error(err));
  };

  if (!user) return <h2>Please login first</h2>;
  if (loading) return <div>Loading listings...</div>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Listings</h1>
      <button
        style={btn}
        onClick={() => navigate("/seller/listings/new")}
      >
        + Create New Listing
      </button>

      {listings.length === 0 ? (
        <p style={{ marginTop: "20px" }}>You have no listings yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTd}>Title</th>
              <th style={thTd}>Brand</th>
              <th style={thTd}>Price</th>
              <th style={thTd}>Status</th>
              <th style={thTd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.listing_id}>
                <td style={thTd}>{listing.title}</td>
                <td style={thTd}>{listing.brand}</td>
                <td style={thTd}>{listing.price}</td>
                <td style={thTd}>{listing.status}</td>
                <td style={thTd}>
                  <button
                    style={smallBtn}
                    onClick={() =>
                      navigate(`/seller/listings/edit/${listing.listing_id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    style={smallBtnDanger}
                    onClick={() => handleDelete(listing.listing_id)}
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
  );
}

const btn = {
  marginTop: "10px",
  padding: "8px 16px",
  background: "#2979ff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableStyle = {
  marginTop: "20px",
  width: "100%",
  borderCollapse: "collapse"
};

const thTd = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left"
};

const smallBtn = {
  marginRight: "8px",
  padding: "4px 10px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const smallBtnDanger = {
  ...smallBtn,
  background: "#e53935"
};
