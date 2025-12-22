# Dockerfile

FROM node:20-alpine
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ด Next.js ทั้งหมดจากรูทโฟลเดอร์
COPY . .

# สร้างแอปพลิเคชัน Next.js
RUN npm run build

EXPOSE 3000


# บน cloud
CMD [ "npm", "start" ] 
# CMD [ "npm", "run", "dev" ] # ไม่ต้องใช้ เพราะจะกำหนดใน docker-compose