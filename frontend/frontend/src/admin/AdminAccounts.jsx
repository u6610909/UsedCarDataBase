import { Link } from "react-router-dom";

export default function AdminAccounts() {
  const users = [
    { role: "ADMIN", name: "Admin One", id: "ID 1" },
    { role: "BUYER", name: "Buyer One", id: "ID 3" },
    { role: "SELLER", name: "Seller One", id: "ID 2" },
  ];

  return (
    <div style={styles.page}>
      {/* Top Navigation */}
      <div style={styles.navbar}>
        <Link to="/admin/accounts" style={styles.navItemActive}>ACCOUNTS</Link>
        <Link to="/admin/pending" style={styles.navItem}>APPROVE</Link>
        <Link to="/admin/activity" style={styles.navItem}>ACTIVITY</Link>
      </div>

      {/* Header */}
      <h1 style={styles.header}>USER ACCOUNTS</h1>

      {/* Table */}
      <div style={styles.tableBox}>
        <div style={styles.tableHeader}>
          <div>ROLE</div>
          <div>NAME</div>
          <div style={{ textAlign: "right" }}>ID</div>
        </div>

        {users.map((u, i) => (
          <div key={i} style={styles.tableRow}>
            <div>{u.role}</div>
            <div>{u.name}</div>
            <div style={{ textAlign: "right" }}>{u.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "35px",
    background: "#eef3ff",
    minHeight: "100vh",
  },

  /* Top Navigation */
  navbar: {
    display: "flex",
    gap: "25px",
    background: "#dae3fa",
    padding: "12px 24px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  navItem: {
    textDecoration: "none",
    fontSize: "17px",
    color: "#42557a",
    fontWeight: 500,
  },
  navItemActive: {
    textDecoration: "none",
    fontSize: "17px",
    color: "#1b2f67",
    fontWeight: 700,
    borderBottom: "3px solid #1b2f67",
    paddingBottom: "4px",
  },

  /* Header */
  header: {
    fontSize: "34px",
    color: "#1a2f6b",
    marginBottom: "20px",
  },

  /* Table Styling */
  tableBox: {
    background: "white",
    borderRadius: "12px",
    padding: "15px 20px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "1000px",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    padding: "10px 0",
    fontWeight: "700",
    borderBottom: "2px solid #eee",
    color: "#27364b",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "17px",
    color: "#374a66",
  },
};