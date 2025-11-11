import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { user_id, symptom, severity, since_days } = await req.json();
    if (!user_id || !symptom || !severity) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    await pool.query(
      "INSERT INTO user_reports (user_id, symptom, severity, since_days, status) VALUES (?, ?, ?, ?, 'Pending')",
      [user_id, symptom, severity, since_days]
    );

    return Response.json({ success: true, message: "Issue submitted successfully" });
  } catch (err) {
    console.error("Report Route Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const [rows] = await pool.query(
      `SELECT ur.*
       FROM user_reports ur
       WHERE ur.user_id = ? 
       ORDER BY ur.created_at DESC`,
      [user_id]
    );

    return Response.json({ success: true, reports: rows });
  } catch (err) {
    console.error("Get Reports Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
