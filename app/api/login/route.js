import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const sender = process.env.SMTP_FROM?.trim() || user;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return { host, user, pass, sender, port, secure };
}

async function sendLoginSuccessEmail(email, password) {
  const { host, user, pass, sender, port, secure } = getSmtpConfig();

  if (!email || !password || !user || !pass) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: { rejectUnauthorized: true },
  });

  await transporter.sendMail({
    from: sender,
    to: email,
    replyTo: sender,
    subject: "Yatriguide login successful",
    text: `Login successful.\n\nEmail: ${email}\nPassword: ${password}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="color: #ea580c;">Login successful</h2>
        <p>Your login details have been accepted successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
    `,
  });

  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const emailSent = await sendLoginSuccessEmail(email, password);

    return NextResponse.json({
      message: emailSent
        ? "Login successful and confirmation email sent."
        : "Login successful. Email delivery is not configured yet.",
    });
  } catch (error) {
    console.error("Login API failed", error);
    return NextResponse.json({ error: "Unable to process login right now." }, { status: 500 });
  }
}
