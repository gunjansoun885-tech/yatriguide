import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAllRegistrations } from "@/lib/db";

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
    text: `Login successful.\n\nEmail/Identifier: ${email}\nPassword: ${password}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="color: #ea580c;">Login successful</h2>
        <p>Your login details have been accepted successfully.</p>
        <p><strong>Email/Vehicle Number:</strong> ${email}</p>
      </div>
    `,
  });

  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const identifier = (body.email || body.identifier)?.trim();
    const password = body.password?.trim();

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/Vehicle Number and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanInput = identifier.replace(/[\s-]/g, "").toLowerCase();

    // Check if this vehicle number or email is already registered in DB
    const allRegistrations = await getAllRegistrations();
    const existingRegistration = allRegistrations.find((r) => {
      const normVehicle = (r.vehicleNumber || "").replace(/[\s-]/g, "").toLowerCase();
      const normEmail = (r.email || "").trim().toLowerCase();
      const normId = (r.id || "").replace(/[\s-]/g, "").toLowerCase();
      return (normVehicle && normVehicle === cleanInput) || (normEmail && normEmail === cleanInput) || (normId && normId === cleanInput);
    });

    if (existingRegistration && existingRegistration.registrationPassword) {
      if (existingRegistration.registrationPassword !== password) {
        return NextResponse.json(
          {
            error: "Incorrect password! Yeh vehicle number pehle se registered hai. Aap kisi alag password se login nahi kar sakte, kripya apna purana password hi dalein."
          },
          { status: 401 }
        );
      }
    }

    const emailSent = await sendLoginSuccessEmail(identifier, password);

    return NextResponse.json({
      message: emailSent
        ? "Login successful and confirmation email sent."
        : "Login successful.",
      registration: existingRegistration || null
    });
  } catch (error) {
    console.error("Login API failed", error);
    return NextResponse.json({ error: "Unable to process login right now." }, { status: 500 });
  }
}
