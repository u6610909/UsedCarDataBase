// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

/* ---------- AUTH ง่าย ๆ ---------- */

// login แบบง่าย (ไม่ใช้ token เพื่อให้เข้าใจง่าย)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT user_id, name, email, role FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(result.rows[0]); // {user_id, name, role}
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- BUYER: Browse Listings ---------- */

// ทุกคนดูรถได้เฉพาะที่ถูก approve
app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.name AS seller_name
       FROM car_listings l
       JOIN users u ON l.seller_id = u.user_id
       WHERE l.status = 'approved'
       ORDER BY l.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- SELLER: Manage Own Listings ---------- */

// เพิ่มประกาศรถ (Create)
app.post('/api/listings', async (req, res) => {
  const { seller_id, title, brand, model, year, mileage, price, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO car_listings
       (seller_id, title, brand, model, year, mileage, price, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [seller_id, title, brand, model, year, mileage, price, description]
    );
    // เพิ่ม Log Activity
    await pool.query(
        `INSERT INTO activity_log (user_id, action)
         VALUES ($1, $2)`,
      [seller_id, `Added new car listing: ${title}`]
);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/api/seller/:id/inquiries", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT i.*, 
        u.name AS buyer_name,
        c.title AS listing_title
       FROM inquiries i
       JOIN users u ON i.buyer_id = u.user_id
       JOIN car_listings c ON i.listing_id = c.listing_id
       WHERE c.seller_id = $1
       ORDER BY i.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading inquiries" });
  }
});
app.put("/api/inquiries/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const result = await pool.query(
      "UPDATE inquiries SET seller_reply=$1 WHERE inquiry_id=$2 RETURNING *",
      [reply, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reply failed" });
  }
});

// ดูประกาศของ seller คนเดียว (My Listings)
app.get("/api/seller/:id/listings", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM car_listings WHERE seller_id = $1 ORDER BY listing_id DESC",
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading seller listings" });
  }
});

// GET listings ของ seller เอง
app.get("/api/seller/listings/:seller_id", async (req, res) => {
  const { seller_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM car_listings WHERE seller_id = $1 ORDER BY created_at DESC",
      [seller_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// UPDATE listing (Seller Edit)
app.put("/api/seller/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { title, brand, model, year, mileage, price, description } = req.body;

  // ตรวจค่าว่าห้ามเป็น undefined
  if (!id || !title || !brand || !model || !year || !mileage || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE car_listings
       SET title=$1, brand=$2, model=$3, year=$4, mileage=$5, price=$6, description=$7
       WHERE listing_id=$8
       RETURNING *`,
      [title, brand, model, year, mileage, price, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});
// ดึงข้อมูล listing เดียวตาม id
app.get("/api/seller/listing/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM car_listings WHERE listing_id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Seller respond to inquiry
app.put("/api/inquiries/:id/respond", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    const result = await pool.query(
      `UPDATE inquiries 
       SET response=$1, replied_at=NOW()
       WHERE inquiry_id=$2
       RETURNING *`,
      [response, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Respond failed" });
  }
});
// SELLER: Get all inquiries for seller's listings
app.get("/api/seller/:sellerId/inquiries", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT i.inquiry_id, i.message, i.created_at,
              b.name AS buyer_name,
              l.title AS listing_title
       FROM inquiries i
       JOIN car_listings l ON i.listing_id = l.listing_id
       JOIN users b ON i.buyer_id = b.user_id
       WHERE l.seller_id = $1
       ORDER BY i.created_at DESC`,
      [sellerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Inquiry error:", err);
    res.status(500).json({ message: "Server error loading inquiries" });
  }
});
// Seller accepts buyer offer
app.put("/api/inquiries/:id/accept", async (req, res) => {
  const inquiryId = req.params.id;

  try {
    // 1. หา listing_id ของ inquiry นี้
    const inquiry = await pool.query(
      "SELECT listing_id FROM inquiries WHERE inquiry_id=$1",
      [inquiryId]
    );

    if (inquiry.rows.length === 0) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const listingId = inquiry.rows[0].listing_id;

    // 2. เปลี่ยนรถเป็น sold
    await pool.query(
      "UPDATE car_listings SET status='sold' WHERE listing_id=$1",
      [listingId]
    );

    res.json({ message: "Offer accepted. Listing marked as SOLD." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ดูประกาศทีละรายการ (ใช้ตอน Edit)
app.get('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM car_listings WHERE listing_id=$1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// แก้ไขประกาศ (Update)
app.put("/api/seller/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { title, brand, model, year, mileage, price, description } = req.body;

  // ตรวจว่าค่าครบไหม
  if (!id || !title || !brand || !model || !year || !mileage || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE car_listings
       SET title=$1, brand=$2, model=$3, year=$4, mileage=$5, price=$6, description=$7
       WHERE listing_id=$8
       RETURNING *`,
      [title, brand, model, year, mileage, price, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ลบประกาศ (Delete)
app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM car_listings WHERE listing_id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- SELLER: Dashboard Stats ---------- */
app.get("/api/seller/:id/stats", async (req, res) => {
  const sellerId = req.params.id;

  try {
    const total = await pool.query(
      "SELECT COUNT(*) FROM car_listings WHERE seller_id=$1",
      [sellerId]
    );

    const approved = await pool.query(
      "SELECT COUNT(*) FROM car_listings WHERE seller_id=$1 AND status='approved'",
      [sellerId]
    );

    const pending = await pool.query(
      "SELECT COUNT(*) FROM car_listings WHERE seller_id=$1 AND status='pending'",
      [sellerId]
    );

    const rejected = await pool.query(
      "SELECT COUNT(*) FROM car_listings WHERE seller_id=$1 AND status='rejected'",
      [sellerId]
    );

    res.json({
      total: total.rows[0].count,
      approved: approved.rows[0].count,
      pending: pending.rows[0].count,
      rejected: rejected.rows[0].count
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------- ADMIN: Approve / Reject ---------- */

app.get('/api/admin/pending-listings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.name AS seller_name
       FROM car_listings l
       JOIN users u ON l.seller_id = u.user_id
       WHERE l.status = 'pending'
       ORDER BY l.created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get("/api/admin/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY role");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});
app.get("/api/admin/activity", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.name 
      FROM activity_log a
      LEFT JOIN users u ON a.user_id = u.user_id
      ORDER BY a.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});

app.put('/api/admin/listings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' หรือ 'rejected'
  try {
    const result = await pool.query(
      'UPDATE car_listings SET status=$1 WHERE listing_id=$2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    // เพิ่ม Log Activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action)
     VALUES ($1, $2)`,
     [1, `${status.toUpperCase()} listing ${id}`]  // ใส่ admin_id ถ้ามี
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- BUYER: Inquiries ---------- */

app.post('/api/inquiries', async (req, res) => {
  const { buyer_id, listing_id, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inquiries (buyer_id, listing_id, message)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [buyer_id, listing_id, message]
    );
    await pool.query(
      `INSERT INTO activity_log (user_id, action)
      VALUES ($1, $2)`,
     [buyer_id, `Sent inquiry for listing ${listing_id}`]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get("/api/admin/activity", async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT a.*, u.name AS user_name
      FROM activity_logs a
      JOIN users u ON a.user_id = u.user_id
      ORDER BY a.created_at DESC
    `);

    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load activity logs" });
  }
});
// Seller accepts buyer offer → Mark listing as SOLD
app.put("/api/inquiries/:id/accept", async (req, res) => {
  const inquiryId = req.params.id;
  const { listing_id } = req.body;

  try {
    // 1) Mark car as SOLD
    await pool.query(
      "UPDATE car_listings SET status='sold' WHERE listing_id=$1",
      [listing_id]
    );

    // 2) Optional: mark inquiry as accepted
    await pool.query(
      "UPDATE inquiries SET status='accepted' WHERE inquiry_id=$1",
      [inquiryId]
    );

    res.json({ message: "Offer accepted and car marked as sold." });
  } catch (err) {
    console.error("ACCEPT ERROR:", err);
    res.status(500).json({ message: "Failed to accept offer" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
