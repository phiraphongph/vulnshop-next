-- สร้างตารางผู้ใช้งาน
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- เพิ่มผู้ใช้งานทั่วไป (Non-Admin)
INSERT INTO users (username, password, is_admin)
VALUES ('testuser', 'testpass', FALSE);

-- เพิ่มผู้ใช้งานที่เป็น Admin (เป้าหมายของการโจมตี)
INSERT INTO users (username, password, is_admin)
VALUES ('admin', 'adminpass', TRUE);

-- ตรวจสอบข้อมูลที่ถูกเพิ่ม
SELECT * FROM users;
