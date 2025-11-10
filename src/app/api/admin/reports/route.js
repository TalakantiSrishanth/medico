import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_reports WHERE status='Pending' ORDER BY created_at DESC"
    );
    return Response.json({ success: true, reports: rows });
  } catch (err) {
    console.error("Admin Reports Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
