import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { type, name, email, password } = await req.json();
    if (type === "signup") {
      const [exists] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
      if (exists.length > 0) {
        return Response.json({ error: "Email already registered" }, { status: 400 });
      }

      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
        [name, email, password]
      );

      return Response.json({ success: true, message: "User created successfully" });
    }

    if (type === "login") {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password]
      );

      if (rows.length === 0) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const user = rows[0];

      return Response.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    return Response.json({ error: "Invalid request type" }, { status: 400 });
  } catch (err) {
    console.error("Auth Route Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
