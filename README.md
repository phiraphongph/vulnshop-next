# VulnShop (Vulnerable E-commerce Application)

VulnShop เป็น web application ที่มีช่องโหว่ที่สร้างขึ้นมาเพื่อใช้ในการศึกษา web security และนำกระบวนการ devsecops มาใช้ในการพัฒนา software จริง

## Tech Stack & Tools
- Framework Next.js
- Database PostgreSQL
- CICD & Security Tools
  - GitHub Actions
  - npm audit
  - Trivy
  - ESLint 

## วิธีติดตั้งและใช้งาน
**Clone Repository:**
```bash
git clone -https://github.com/phiraphongph/vulnshop-next.git
cd vulnshop-next
```
**Run Containers:**
```bash
docker compose up -d --build
```
**Access**
- Web App: http://localhost:8888/
- Database Port: 5433
