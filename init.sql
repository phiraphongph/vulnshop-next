-- create table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    balance DECIMAL(10, 2) DEFAULT 0.00
);

-- add users
INSERT INTO users (username, password, is_admin, balance)
VALUES 
('testuser', 'testpass', FALSE, 1000000.00),
('admin', 'adminpass', TRUE, 1000.00),
('hacker', 'hackerpass', FALSE, 0.00);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    -- review_content คือคอลัมน์ที่จะเก็บ payload XSS 
    review_content TEXT NOT NULL, 
    reviewer_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- add sample reviews
INSERT INTO reviews (product_id, review_content, reviewer_name)
VALUES 
(1, '555', 'Alice'),
(2, '6555', 'Bob');

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);
-- add sample products
INSERT INTO products (product_name, price)
VALUES 
('Product A',3000.00),
('Product B',4500.00),
('Product C',1500.00);

-- verify inserted data
SELECT * FROM users;
SELECT * FROM reviews;
SELECT * FROM products;

