import { Pool } from "pg";

try {
  new Pool({ connectionString: "postgres://" });
  console.log("postgres:// OK");
} catch (e) {
  console.error("postgres:// Error:", e);
}

try {
  new Pool({ connectionString: "" });
  console.log("empty OK");
} catch (e) {
  console.error("empty Error:", e);
}
