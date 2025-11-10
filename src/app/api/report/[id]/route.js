import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [rows] = await pool.query(
      `SELECT ur.*, ar.typical_treatments, ar.notes
       FROM user_reports ur
       LEFT JOIN admin_responses ar ON ur.id = ar.report_id
       WHERE ur.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    const report = rows[0];

    return Response.json({ success: true, report });
  } catch (err) {
    console.error("Get Single Report Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
