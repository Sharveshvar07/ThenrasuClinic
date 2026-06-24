import pg from "pg";
const { Client } = pg;

const client = new Client({
  host:     "localhost",
  port:     5432,
  database: "clinic_db",
  user:     "postgres",
  password: "Admin123",   // ← put your actual password here
});

async function debug() {
  console.log("1. Trying to connect to PostgreSQL...");
  try {
    await client.connect();
    console.log("✅ Connected successfully!\n");
  } catch (err) {
    console.error("❌ Connection FAILED:", err.message);
    console.log("\nFix: Check your password, username, and that PostgreSQL is running.");
    process.exit(1);
  }

  console.log("2. Checking if clinic_db database exists...");
  try {
    const res = await client.query("SELECT current_database()");
    console.log("✅ Database:", res.rows[0].current_database, "\n");
  } catch (err) {
    console.error("❌ Database check failed:", err.message);
  }

  console.log("3. Checking if specialities table exists...");
  try {
    const res = await client.query(`
      SELECT COUNT(*) FROM information_schema.tables
      WHERE table_name = 'specialities'
    `);
    if (res.rows[0].count === "0") {
      console.error("❌ Table 'specialities' does NOT exist!");
      console.log("Fix: Run the CREATE TABLE SQL in pgAdmin.\n");
    } else {
      console.log("✅ Table exists!\n");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  console.log("4. Checking specialities data...");
  try {
    const res = await client.query("SELECT COUNT(*) FROM specialities");
    console.log("✅ Rows in specialities:", res.rows[0].count);
    if (res.rows[0].count === "0") {
      console.log("⚠️  Table is EMPTY — you need to insert the specialty data!");
    }
  } catch (err) {
    console.error("❌ Error reading specialities:", err.message);
  }

  await client.end();
  console.log("\nDone. Fix any ❌ issues above and restart your server.");
}

debug();