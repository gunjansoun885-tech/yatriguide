import { randomBytes, scryptSync } from "crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getNetworkBaseUrl(request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
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

const dataDirectory = path.join(process.cwd(), "data");
const registrationsDirectory = path.join(dataDirectory, "registrations");
const registrationsFile = path.join(dataDirectory, "registrations.json");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createRegistrationId() {
  return `YS-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

import { getAllRegistrations, saveRegistration } from "@/lib/db";
import { encodePassData } from "@/lib/pass-utils";

async function listRegistrations() {
  await mkdir(registrationsDirectory, { recursive: true });

  const files = await readdir(registrationsDirectory, { withFileTypes: true });
  const registrationFiles = files
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);

  const registrations = await Promise.all(
    registrationFiles.map(async (fileName) => {
      const filePath = path.join(registrationsDirectory, fileName);
      const content = await readFile(filePath, "utf8");
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }),
  );

  return registrations.filter(Boolean).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function buildPayload(registration) {
  const passengerDetails = registration.passengerDetails?.length
    ? registration.passengerDetails.map((passenger, index) => `${index + 1}. ${passenger.name}, ${passenger.age}, ${passenger.gender}`).join("\n")
    : "-";

  return [
    `Registration ID: ${registration.id}`,
    `Vehicle Number: ${registration.vehicleNumber || "-"}`,
    `Vehicle Type: ${registration.vehicleType || "-"}`,
    `Journey: ${registration.travelFrom || "-"} to ${registration.travelTo || "-"}`,
    `Travel Dates: ${registration.tourFrom || "-"} to ${registration.tourTo || "-"}`,
    `Driver Type: ${registration.driverType || "-"}`,
    `Owner Name: ${registration.ownerName || registration.vehicleOwnerName || "-"}`,
    `Driver Name: ${registration.driverName || registration.otherName || "-"}`,
    `Email: ${registration.email || "-"}`,
    `Passengers:\n${passengerDetails}`,
    `Additional Note: ${registration.message || "-"}`,
  ].join("\n");
}

function buildHtmlEmail(registration) {
  const passengerRows = registration.passengerDetails?.length
    ? registration.passengerDetails
        .map(
          (p, i) => `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 8px 12px; color: #444;">${i + 1}</td>
            <td style="padding: 8px 12px; color: #111; font-weight: 600;">${escapeHtml(p.name || "-")}</td>
            <td style="padding: 8px 12px; color: #444;">${escapeHtml(p.age || "-")} yrs</td>
            <td style="padding: 8px 12px; color: #444;">${escapeHtml(p.gender || "-")}</td>
          </tr>
        `,
        )
        .join("")
    : `<tr><td colspan="4" style="padding: 8px 12px; color: #888; text-align: center;">No passenger details added</td></tr>`;

  const driverName =
    registration.driverType === "owner"
      ? registration.ownerName
      : registration.driverType === "driver"
        ? registration.driverName
        : registration.otherName;

  const driverPhone =
    registration.driverType === "owner"
      ? registration.ownerPhone
      : registration.driverType === "driver"
        ? registration.driverPhone
        : registration.otherPhone;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f8fa; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #eee; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.95; }
          .badge { display: inline-block; background: #ffffff; color: #c2410c; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-top: 12px; font-size: 13px; font-family: monospace; }
          .body-content { padding: 24px; }
          .section-title { font-size: 15px; font-weight: 700; color: #ea580c; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .grid td { padding: 6px 0; font-size: 14px; }
          .grid td.label { color: #666; width: 40%; font-weight: 500; }
          .grid td.val { color: #111; font-weight: 600; }
          .table-custom { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; text-align: left; }
          .table-custom th { background: #fff7ed; color: #c2410c; padding: 8px 12px; border-bottom: 2px solid #ffedd5; }
          .footer { background: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Yatriguide</h1>
            <p>Registration Successful!</p>
            <div class="badge">ID: ${escapeHtml(registration.id)}</div>
          </div>
          <div class="body-content">
            <p style="font-size: 15px; color: #15803d; font-weight: 600; text-align: center; margin-bottom: 20px;">
              ✅ Your vehicle travel registration has been processed successfully.
            </p>

            <div class="section-title">🚘 Vehicle & Travel Summary</div>
            <table class="grid">
              <tr><td class="label">Registration ID:</td><td class="val">${escapeHtml(registration.id)}</td></tr>
              <tr><td class="label">Vehicle Number:</td><td class="val">${escapeHtml(registration.vehicleNumber || "-")}</td></tr>
              <tr><td class="label">Category:</td><td class="val" style="text-transform: capitalize;">${escapeHtml(registration.vehicleType || "-")}</td></tr>
              <tr><td class="label">Route:</td><td class="val">${escapeHtml(registration.travelFrom || "-")} &rarr; ${escapeHtml(registration.travelTo || "-")}</td></tr>
              <tr><td class="label">Travel Dates:</td><td class="val">${escapeHtml(registration.tourFrom || "-")} to ${escapeHtml(registration.tourTo || "-")}</td></tr>
            </table>

            <div class="section-title">👤 Driver & Contact Details</div>
            <table class="grid">
              <tr><td class="label">Driver Name:</td><td class="val">${escapeHtml(driverName || "-")}</td></tr>
              <tr><td class="label">Contact Phone:</td><td class="val">${escapeHtml(driverPhone || "-")}</td></tr>
              <tr><td class="label">Emergency Contact:</td><td class="val" style="color: #dc2626;">${escapeHtml(registration.emergencyContactNo || "-")}</td></tr>
            </table>

            <div class="section-title">👥 Passenger List</div>
            <table class="table-custom">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                ${passengerRows}
              </tbody>
            </table>

            ${
              registration.message
                ? `
              <div class="section-title">📝 Additional Note</div>
              <p style="font-size: 13px; color: #444; background: #fff7ed; padding: 12px; border-radius: 8px; border-left: 4px solid #f97316;">${escapeHtml(registration.message)}</p>
            `
                : ""
            }

            <p style="font-size: 13px; color: #666; margin-top: 24px; text-align: center;">
              Please save your Registration QR code for easy verification at check-posts during your travel.
            </p>
          </div>
          <div class="footer">
            &copy; 2026 Yatriguide | Safe Uttarakhand Travel Portal<br/>
            For support, contact support@yatriguide.in
          </div>
        </div>
      </body>
    </html>
  `;
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

async function sendConfirmationEmail(registration) {
  const { host, user, pass, sender, port, secure } = getSmtpConfig();
  if (!registration.email) return false;

  if (!user || !pass) {
    console.log(`[SMTP Notice] SMTP credentials not set in process.env. Skipped sending email to ${registration.email}. Please set SMTP_USER and SMTP_PASS in .env.local to enable real email sending.`);
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

  const payload = buildPayload(registration);
  const htmlPayload = buildHtmlEmail(registration);

  await transporter.sendMail({
    from: sender,
    to: registration.email,
    replyTo: sender,
    subject: `Yatriguide Registration Successful - ID: ${registration.id}`,
    text: payload,
    html: htmlPayload,
  });
  return true;
}

export async function GET(request) {
  const ownerKey = process.env.ADMIN_ACCESS_KEY?.trim();
  const providedKey = request.headers.get("x-owner-key")?.trim();

  if (!ownerKey || providedKey !== ownerKey) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
  }

  try {
    const registrations = await listRegistrations();
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Registration listing failed", error);
    return NextResponse.json({ error: "Unable to load registrations right now." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.vehicleNumber?.trim()) {
      return NextResponse.json({ error: "Vehicle registration number is required." }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (!body.registrationPassword || body.registrationPassword !== body.confirmRegistrationPassword) {
      return NextResponse.json({ error: "Please enter matching passwords." }, { status: 400 });
    }

    const cleanVehicleNumber = body.vehicleNumber.trim();
    const normSubmittedVehicle = cleanVehicleNumber.replace(/[\s-]/g, "").toLowerCase();

    // Verify if same vehicle number already exists with a different password
    const allRegistrations = await getAllRegistrations();
    const existingRegistration = allRegistrations.find((r) => {
      const normRegVehicle = (r.vehicleNumber || "").replace(/[\s-]/g, "").toLowerCase();
      return normRegVehicle && normRegVehicle === normSubmittedVehicle;
    });

    if (existingRegistration && existingRegistration.registrationPassword) {
      if (existingRegistration.registrationPassword !== body.registrationPassword) {
        return NextResponse.json(
          {
            error: "Yeh vehicle number pehle se registered hai. Aap kisi alag password se register/login nahi kar sakte. Kripya apna purana password hi dalein."
          },
          { status: 400 }
        );
      }
    }

    const { registrationPassword, confirmRegistrationPassword, travelFromOther, travelToOther, ...details } = body;
    const password = hashPassword(registrationPassword);
    const registration = {
      ...details,
      registrationPassword,
      id: createRegistrationId(),
      travelFrom: details.travelFrom === "Other" ? travelFromOther?.trim() : details.travelFrom,
      travelTo: details.travelTo === "Other" ? travelToOther?.trim() : details.travelTo,
      password,
      createdAt: new Date().toISOString(),
    };

    await saveRegistration(registration);

    let emailSent = false;
    try {
      emailSent = await sendConfirmationEmail(registration);
    } catch (emailError) {
      console.error("Registration saved, but confirmation email failed", emailError);
    }

    const baseUrl = getNetworkBaseUrl(request);
    const passToken = encodePassData(registration);
    const passUrl = passToken
      ? `${baseUrl}/pass?id=${encodeURIComponent(registration.id)}&d=${encodeURIComponent(passToken)}`
      : `${baseUrl}/pass?id=${encodeURIComponent(registration.id)}`;

    return NextResponse.json({
      message: emailSent
        ? `Registration saved! A confirmation message has been sent to ${registration.email}.`
        : "Registration saved successfully.",
      registrationId: registration.id,
      passUrl,
      emailSent,
    });
  } catch (error) {
    console.error("Registration save failed", error);
    return NextResponse.json({ error: "Unable to save registration right now." }, { status: 500 });
  }
}
