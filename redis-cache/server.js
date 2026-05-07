const express = require("express");
const mysql = require("mysql2/promise");
const redis = require("redis");

const app = express();

// MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "perfo_lab_03",
});

// Redis
const client = redis.createClient();

client.connect();

app.get("/products", async (req, res) => {
  const cacheKey = "products:laptop";

  // 1. Check cache
  const cached = await client.get(cacheKey);

  if (cached) {
    return res.json({
      source: "redis",
      data: JSON.parse(cached),
    });
  }

  // 2. DB query
  const [rows] = await pool.query(`
    SELECT * FROM products
    WHERE category = 'Laptop'
    ORDER BY created_at DESC
    LIMIT 50
  `);

  // 3. Save to Redis (10 sec TTL)
  await client.setEx(cacheKey, 10, JSON.stringify(rows));

  res.json({
    source: "database",
    data: rows,
  });
});

app.listen(3001, () => console.log("Redis cache 3001"));