import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host:     "localhost",
  port:     5432,
  database: "postgres",
  user:     "postgres",
  password: "Admin123",   // ← your actual PostgreSQL password here
});

// Test connection immediately when server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ DB CONNECTION FAILED:", err.message);
    console.error("   Check: host, port, database, user, password in db.js");
  } else {
    console.log("✅ PostgreSQL connected successfully!");
    release();
  }
});

export default pool;