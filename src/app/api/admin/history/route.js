import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT ur.*
       FROM user_reports ur
       WHERE ur.status = 'Resolved'
       ORDER BY ur.created_at DESC`
    );

    return Response.json({ success: true, reports: rows });
  } catch (err) {
    console.error("Admin History Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
