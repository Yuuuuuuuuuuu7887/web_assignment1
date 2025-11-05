// ✅ ใช้ ES Module แบบเดียวทั้งหมด
import express from "express"
import cors from "cors"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// ✅ ให้ Express อ่าน JSON
app.use(express.json())

// ✅ เปิดใช้งาน CORS แบบ global
app.use(cors())

// ✅ ป้องกัน preflight error (บางครั้ง Vercel ไม่ตอบ OPTIONS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // หรือระบุ frontend ก็ได้
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }
  next()
})

// ✅ โหลดค่าจาก .env
const SERVER1_URL = process.env.SERVER1_URL
const SERVER2_URL = process.env.SERVER2_URL
const logToken = process.env.LOG_API_TOKEN
const PORT = process.env.PORT || 3000

// ✅ ฟังก์ชันดึงข้อมูลจาก Server 1
async function fetchData1() {
  if (!SERVER1_URL) {
    console.error("❌ Missing SERVER1_URL in .env")
    return []
  }

  try {
    const response1 = await axios.get(SERVER1_URL)
    console.log(`✅ Fetched ${response1.data.data.length} configs from SERVER1`)
    return response1.data.data
  } catch (error) {
    console.error("Error fetching data:", error.message)
    return []
  }
}

// ✅ ดึง config ตาม droneId
app.get("/configs/:droneId", async (req, res) => {
  try {
    const { droneId } = req.params
    const allConfigs = await fetchData1()

    const droneConfig = allConfigs.find((c) => c.drone_id == droneId)
    if (!droneConfig) {
      return res.status(404).json({ error: "Drone config not found" })
    }

    const result = {
      drone_id: droneConfig.drone_id,
      drone_name: droneConfig.drone_name,
      light: droneConfig.light,
      country: droneConfig.country,
      weight: droneConfig.weight,
    }

    res.json(result)
  } catch (error) {
    console.error("Error fetching drone config:", error.message)
    res.status(500).json({ error: "Failed to fetch drone configuration" })
  }
})

// ✅ ดึงสถานะ
app.get("/status/:droneId", async (req, res) => {
  try {
    const { droneId } = req.params
    const allConfigs = await fetchData1()
    const droneConfig = allConfigs.find((c) => c.drone_id == droneId)
    if (!droneConfig) {
      return res.status(404).json({ error: "Drone config not found" })
    }

    res.json({ condition: droneConfig.condition })
  } catch (error) {
    console.error("Error fetching drone status:", error.message)
    res.status(500).json({ error: "Failed to fetch drone status" })
  }
})

// ✅ ดึง logs ของ drone
app.get("/logs/:droneId", async (req, res) => {
  try {
    const { droneId } = req.params
    const page = req.query.page || 1

    const authHeaders = {
      Authorization: `Bearer ${logToken}`,
    }

    const response = await axios.get(SERVER2_URL, {
      headers: authHeaders,
      params: {
        filter: `(drone_id = ${droneId})`,
        perPage: 12,
        sort: "-created",
        fields: "drone_id,drone_name,created,country,celsius",
        page,
      },
    })

    const orderedItems = (response.data.items || []).map((item) => ({
      drone_id: item.drone_id,
      drone_name: item.drone_name,
      created: item.created,
      country: item.country,
      celsius: item.celsius,
    }))

    res.json(orderedItems)
  } catch (error) {
    console.error("Error fetching logs:", error.message)
    res.status(500).json({ error: "Failed to fetch logs" })
  }
})

// ✅ เพิ่ม log ใหม่
app.post("/logs", async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required log data" })
    }

    const authHeaders = {
      Authorization: `Bearer ${logToken}`,
      "Content-Type": "application/json",
    }

    const response = await axios.post(
      SERVER2_URL,
      { drone_id, drone_name, country, celsius },
      { headers: authHeaders }
    )

    res.status(201).json(response.data)
  } catch (error) {
    console.error(
      "Error creating log:",
      error.response ? error.response.data : error.message
    )
    res.status(500).json({ error: "Failed to create log" })
  }
})

// ✅ run server (local เท่านั้น)
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

export default app
