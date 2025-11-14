-- create table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- add sample users
INSERT INTO users (username, password, is_admin)
VALUES ('testuser', 'testpass', FALSE);

-- add admin user
INSERT INTO users (username, password, is_admin)
VALUES ('admin', 'adminpass', TRUE);

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

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- verify inserted data
SELECT * FROM users;
SELECT * FROM reviews;
SELECT * FROM products;

