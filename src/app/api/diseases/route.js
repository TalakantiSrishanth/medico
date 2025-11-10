import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM diseases ORDER BY id ASC");
    console.log(rows);
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch diseases" }, { status: 500 });
  }
}
