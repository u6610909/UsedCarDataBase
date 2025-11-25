-- USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin','seller','buyer'))
);

-- CAR LISTINGS TABLE (เพิ่ม image)
CREATE TABLE car_listings (
    listing_id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT CHECK (year >= 1980),
    mileage INT,
    price NUMERIC(12,2) NOT NULL CHECK (price > 0),
    description TEXT,
    image VARCHAR(255),   -- ⭐ โหลดรูปจาก frontend/public
    status VARCHAR(10) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected','sold')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- INQUIRIES TABLE
CREATE TABLE inquiries (
    inquiry_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES car_listings(listing_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- FAVORITES TABLE
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES car_listings(listing_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (buyer_id, listing_id)
);

-- DEFAULT USERS
INSERT INTO users (name,email,password,role) VALUES
('Admin One','admin@example.com','admin123','admin'),
('Seller One','seller@example.com','seller123','seller'),
('Buyer One','buyer@example.com','buyer123','buyer');

-- ⭐ SAMPLE CAR LISTING พร้อมรูป
INSERT INTO car_listings
(seller_id, title, brand, model, year, mileage, price, description, image, status)
VALUES
(
    2,
    'Toyota Vios 2018',
    'Toyota',
    'Vios',
    2018,
    55000,
    329000.00,
    'Beautiful car, very clean interior',
    'car2.jpg',         -- ⭐ ชื่อไฟล์รูปใน public/
    'approved'
);
