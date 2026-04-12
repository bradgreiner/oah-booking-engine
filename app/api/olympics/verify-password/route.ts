import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.OLYMPICS_PASSWORD ?? "olympics2028";

  if (password === expected) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("olympics_access", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.json(
    { success: false, error: "Invalid password" },
    { status: 401 }
  );
}
