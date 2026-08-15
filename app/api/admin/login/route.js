import { NextResponse } from "next/server";
import { verifyAdminCredentials, generateSessionToken, COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Admin email and password are required." }, { status: 400 });
    }

    // Verify against authorized admin accounts (Owner & Admin)
    const adminUser = verifyAdminCredentials(email, password);

    if (!adminUser) {
      return NextResponse.json(
        { error: "Invalid admin email or password. Access restricted to authorized admins." },
        { status: 401 }
      );
    }

    // Generate cryptographically signed JWT/HMAC session token
    const token = generateSessionToken(adminUser.email, adminUser.role);

    const response = NextResponse.json({
      success: true,
      message: `Admin login successful. Welcome ${adminUser.name}!`,
      user: {
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      },
    });

    // Set secure HTTP-Only session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Unable to process login request." }, { status: 500 });
  }
}
