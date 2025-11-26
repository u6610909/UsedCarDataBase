import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerInquiries() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/api/seller/${user.user_id}/inquiries`)
      .then((res) => res.json())
      .then((data) => setInquiries(data))
      .catch((err) => console.error(err));
  }, []);

  const acceptOffer = (inquiryId, listingId) => {
    fetch(`http://localhost:4000/api/inquiries/${inquiryId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Offer accepted!");

        setInquiries((prev) =>
          prev.map((inq) =>
            inq.inquiry_id === inquiryId
              ? { ...inq, status: "accepted" }
              : inq
          )
        );
      })
      .catch(() => alert("Failed to accept offer"));
  };

  return (
    <div style={{ padding: "30px", background: "#e8f1ff", minHeight: "100vh" }}>
      
      {/* 🔹 ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate("/seller/dashboard")}
        style={{
          padding: "10px 18px",
          background: "#1a73e8",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <h1 style={{ fontSize: "36px", color: "#1a4fa3" }}>Buyer Inquiries</h1>

      {inquiries.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No inquiries received yet.</p>
      ) : (
        <div style={{ marginTop: "25px" }}>
          {inquiries.map((inq) => (
            <div
              key={inq.inquiry_id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{inq.listing_title}</h3>
              <p><b>Buyer:</b> {inq.buyer_name}</p>
              <p><b>Message:</b> {inq.message}</p>
              <p style={{ color: "#777", fontSize: "14px" }}>
                {new Date(inq.created_at).toLocaleString()}
              </p>

              {inq.status === "accepted" ? (
                <button
                  style={{
                    background: "#d9534f",
                    color: "white",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "default",
                    marginTop: "15px",
                  }}
                >
                  Offer Accepted
                </button>
              ) : (
                <button
                  style={{
                    background: "#28a745",
                    color: "white",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "15px",
                  }}
                  onClick={() => acceptOffer(inq.inquiry_id, inq.listing_id)}
                >
                  Accept Offer
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}