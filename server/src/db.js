const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });

pool.on("error", (err) => {
  console.error("❌ Unexpected database error", err);
  process.exit(1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
