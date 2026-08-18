import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import os from "os";
import { getAllRegistrations } from "@/lib/db";
import { encodePassData } from "@/lib/pass-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getNetworkBaseUrl(request) {
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const hostHeader = request?.headers?.get("host") || "";
  const proto = request?.headers?.get("x-forwarded-proto") || (hostHeader.includes("localhost") ? "http" : "https");

  if (hostHeader.startsWith("localhost") || hostHeader.startsWith("127.0.0.1")) {
    const port = hostHeader.split(":")[1] || "3000";
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
          if (iface.family === "IPv4" && !iface.internal && iface.address) {
            return `http://${iface.address}:${port}`;
          }
        }
      }
    } catch {}
  }

  return `${proto}://${hostHeader || "localhost:3000"}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !password) return false;
  if (typeof storedPassword === "string") {
    return password === storedPassword;
  }
  if (storedPassword.hash && storedPassword.salt) {
    const computedHash = crypto.scryptSync(password, storedPassword.salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedPassword.hash));
  }
  return false;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const sender = process.env.SMTP_FROM?.trim() || user;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return { host, user, pass, sender, port, secure };
}

async function sendLoginSuccessEmail(email, password, reg) {
  const { host, user, pass, sender, port, secure } = getSmtpConfig();

  if (!email || !user || !pass) {
    return false;
  }

  try {
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
      subject: "YatriGuide Login Successful 🎉",
      text: `Login successful.\n\nIdentifier: ${email}\nRegistration ID: ${reg?.id || "N/A"}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; padding: 20px;">
          <h2 style="color: #ea580c;">YatriGuide Login Successful</h2>
          <p>Aapne YatriGuide portal par safalta-purvak sign in kiya hai.</p>
          <p><strong>Registration ID:</strong> ${reg?.id || "N/A"}</p>
          <p><strong>Vehicle Number:</strong> ${reg?.vehicleNumber || email}</p>
        </div>
      `,
    });

    return true;
  } catch {
    return false;
  }
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
    const matchingRegistrations = allRegistrations.filter((r) => {
      const normVehicle = (r.vehicleNumber || "").replace(/[\s-]/g, "").toLowerCase();
      const normEmail = (r.email || "").trim().toLowerCase();
      const normId = (r.id || "").replace(/[\s-]/g, "").toLowerCase();
      return (
        (normVehicle && normVehicle === cleanInput) ||
        (normEmail && normEmail === cleanInput) ||
        (normId && normId === cleanInput)
      );
    });

    if (matchingRegistrations.length === 0) {
      return NextResponse.json(
        {
          error: "Koi registration record nahi mila is Email / Vehicle Number ke liye. Kripya pehle travel registration karein.",
        },
        { status: 404 }
      );
    }

    // Check password against matching registrations
    const matchedReg = matchingRegistrations.find((r) => {
      if (r.registrationPassword && r.registrationPassword === password) return true;
      if (r.password && verifyPassword(password, r.password)) return true;
      return false;
    });

    if (!matchedReg) {
      return NextResponse.json(
        {
          error: "Incorrect password! Kripya apna sahi registration password dalein.",
        },
        { status: 401 }
      );
    }

    const baseUrl = getNetworkBaseUrl(request);
    const passToken = encodePassData(matchedReg);
    const passUrl = passToken
      ? `${baseUrl}/pass?id=${encodeURIComponent(matchedReg.id)}&d=${encodeURIComponent(passToken)}`
      : `${baseUrl}/pass?id=${encodeURIComponent(matchedReg.id)}`;

    if (matchedReg.email && matchedReg.email.includes("@")) {
      sendLoginSuccessEmail(matchedReg.email, password, matchedReg).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Login successful! Opening registration pass details...",
      registration: matchedReg,
      passUrl,
    });
  } catch (error) {
    console.error("Login API failed", error);
    return NextResponse.json({ error: "Unable to process login right now." }, { status: 500 });
  }
}
