import { Pool } from "pg";

try {
  const pool = new Pool({ connectionString: "undefined" });
  console.log("Pool created without error");
} catch (e) {
  console.error("Synchronous error:", e);
}
