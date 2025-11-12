import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { report_id, symptom, severity, treatments, notes } = await req.json();

    await pool.query(
      "INSERT INTO admin_responses (report_id, symptom, severity, typical_treatments, notes) VALUES (?, ?, ?, ?, ?)",
      [report_id, symptom, severity, JSON.stringify(treatments), notes]
    );
    
    await pool.query("UPDATE user_reports SET status='Resolved' WHERE id=?", [report_id]);
    return Response.json({ success: true });
  } catch (err) {
    console.error("Admin Respond Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
