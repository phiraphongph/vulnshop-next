# VulnShop Security Assessment Report

## 1. Vulnerability Summary (สรุปช่องโหว่)

| ID          | Vulnerability Name              | Type           | Severity        | Status   |
| :---------- | :------------------------------ | :------------- | :-------------- | :------- |
| **VULN-01** | SQL Injection on Login Page     | Manual Pentest | 🔴 **CRITICAL** | ✅ Fixed |
| **VULN-02** | RCE in Next.js Dependency       | Automated Scan | 🔴 **CRITICAL** | ✅ Fixed |
| **VULN-03** | Race Condition in `tar` Package | Automated Scan | 🟠 **MODERATE** | ✅ Fixed |

---

## 2. Detailed Findings (รายละเอียดทางเทคนิค)

### VULN-01: Remote Code Execution (RCE) in Next.js

- **Severity:** **CRITICAL** (CVSS v3.1: 9.8)
- **Location:** package.json
- **reference:** GHSA-9qr9-h5gf-34mp

### Discovery (การค้นพบ)

run Security Pipeline ใน GitHub Action โดยใช้คำสั่ง npm audit
**Audit Log:**

```bash
next 15.5.1-canary.0 - 15.5.6
Severity: critical
Next.js is vulnerable to RCE in React flight protocol -[https://github.com/advisories/GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)
fix available via `npm audit fix --force`
Will install next@15.5.7, which is outside the stated dependency range
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
