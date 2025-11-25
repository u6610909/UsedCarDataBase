
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL, -- เก็บ password hash (หรือ plain-text ถ้าเอาง่าย ๆ)
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin','seller','buyer'))
);


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
    status VARCHAR(10) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected','sold')),
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE inquiries (
    inquiry_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES car_listings(listing_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES car_listings(listing_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (buyer_id, listing_id)
);


INSERT INTO users (name,email,password,role) VALUES
('Admin One','admin@example.com','admin123','admin'),
('Seller One','seller@example.com','seller123','seller'),
('Buyer One','buyer@example.com','buyer123','buyer');
