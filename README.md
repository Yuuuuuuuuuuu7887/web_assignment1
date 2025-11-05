# web_assignment1
โปรเจกต์ Backend (API) ที่สร้างด้วย Node.js และ Express.js โดยทำหน้าที่เป็นตัวกลางสำหรับโปรเจกต์ Assignment 2(Frontend)

### รายละเอียดโปรเจกต์
โปรเจกต์นี้ไม่ได้เก็บข้อมูลไว้เอง แต่ทำหน้าที่เป็น "ตัวกลาง" ในการดึงข้อมูลจาก Server ภายนอก 2 แห่ง และรวบรวม API Endpoints ให้ Frontend เรียกใช้งานได้ง่ายในที่เดียว

### หน้าที่หลัก:
1.ดึงข้อมูล Config: เชื่อมต่อไปยัง SERVER1_URL เพื่อดึงข้อมูลการตั้งค่า Drone ทั้งหมด

2.ดึงข้อมูล Logs: เชื่อมต่อไปยัง SERVER2_URL (เช่น PocketBase) เพื่อดึงและสร้าง Log การบิน

3.Caching: เก็บข้อมูล Config จาก Server 1 ไว้ใน Cache (configCache) เพื่อเพิ่มความเร็วในการตอบสนอง และลดการยิง API ไปยัง Server 1 ซ้ำๆ


### เทคโนโลยีที่ใช้
-Node.js
-Express.js
-Axios (สำหรับยิง API)
-CORS (สำหรับจัดการสิทธิ์)
-Dotenv (สำหรับจัดการตัวแปร)

### วิธีการใช้งาน(cloud)

1.ไปที่ URL https://assignment1-xi-gold.vercel.app/

2.ใช้ GET โดย `/configs/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server1 https://assignment1-xi-gold.vercel.app/configs/66010675

3.ใช้ GET โดย `/status/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server1 ให้มีเฉพาะ condition https://assignment1-xi-gold.vercel.app/configs/66010675

4.ใช้ GET โดย `/logs/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server2 และทำ pagination และเรียงลำดับ https://assignment1-xi-gold.vercel.app/configs/66010675

5.ใช้ POST โดยเข้าไปที่ Bruno แล้วใส่ URL `/logs` โดย https://assignment1-xi-gold.vercel.app/logs และใส่ข้อมูล drone_id,drone_name,country,celsius เพื่อส่งข้อมูลไปให้server2

### วิธีการใช้งาน(localhost)

1.Clone โปรเจกต์นี้ลงมา
2.ติดตั้ง npm install
3.สร้างไฟล์ .env
```
//URL ของ Server 1 (ที่เก็บข้อมูล Config)

SERVER1_URL="{URLServer 1}"

//URL ของ Server 2 (ที่เก็บข้อมูล Logs)

SERVER2_URL="{URLServer2}"

//Token สำหรับยืนยันตัวตนกับ Server 2

LOG_API_TOKEN="TOKEN"

//Port ที่ Server นี้จะรัน

PORT=8080
```
4.รันเซิร์ฟเวอร์
`node server.js`
เซิร์ฟเวอร์จะทำงานที่ http://localhost:8080

5.ใช้ GET โดย `/configs/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server1 http://localhost:8080/configs/66010675

6.ใช้ GET โดย `/status/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server1 ให้มีเฉพาะ condition http://localhost:8080/configs/66010675

7.ใช้ GET โดย `/logs/{droneId}` เพื่อขอข้อมูลที่ไอดีนั้นๆจาก Server2 และทำ pagination และเรียงลำดับ http://localhost:8080/configs/66010675

8.ใช้ POST โดยเข้าไปที่ Bruno แล้วใส่ URL `/logs` โดย http://localhost:8080/logs และใส่ข้อมูล drone_id,drone_name,country,celsius เพื่อส่งข้อมูลไปให้server2






