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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ดูประกาศของ seller คนเดียว (My Listings)
app.get('/api/seller/:sellerId/listings', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM car_listings WHERE seller_id=$1 ORDER BY created_at DESC',
      [sellerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
app.put('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  const { title, brand, model, year, mileage, price, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE car_listings
       SET title=$1, brand=$2, model=$3, year=$4, mileage=$5, price=$6, description=$7
       WHERE listing_id=$8
       RETURNING *`,
      [title, brand, model, year, mileage, price, description, id]
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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
