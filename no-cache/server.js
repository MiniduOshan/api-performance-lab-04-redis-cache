const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "perfo_lab_03",
});

app.get("/products", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT * FROM products
    WHERE category = 'Laptop'
    ORDER BY created_at DESC
    LIMIT 50
  `);

  res.json(rows);
});

app.listen(3000, () => console.log("No cache 3000"));