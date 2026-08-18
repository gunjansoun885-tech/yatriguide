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

function buildHtmlEmail(registration, passUrl) {
  const passengerRows = registration.passengerDetails?.length
    ? registration.passengerDetails
        .map(
          (p, i) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 8px; color: #64748b; text-align: center; font-weight: 700;">${i + 1}</td>
            <td style="padding: 10px 8px; color: #0f172a; font-weight: 700;">${escapeHtml(p.name || "-")}</td>
            <td style="padding: 10px 8px; color: #475569; text-align: center;">${escapeHtml(p.age || "-")} yrs</td>
            <td style="padding: 10px 8px; color: #475569; text-align: center;">${escapeHtml(p.gender || "-")}</td>
          </tr>
        `,
        )
        .join("")
    : `<tr><td colspan="4" style="padding: 12px; color: #94a3b8; text-align: center;">No additional passenger details</td></tr>`;

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registration Successful - Yatriguide</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Yatriguide Devbhoomi Guide</h1>
                    <p style="margin: 6px 0 0; font-size: 15px; opacity: 0.95; font-weight: 600;">Registration Successful! 🎉</p>
                    <div style="display: inline-block; background: #ffffff; color: #c2410c; font-weight: 800; padding: 8px 18px; border-radius: 20px; margin-top: 14px; font-size: 14px; font-family: monospace; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                      ID: ${escapeHtml(registration.id)}
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 15px; color: #15803d; font-weight: 700;">
                        ✅ Your Travel Registration has been recorded successfully.
                      </p>
                      <p style="margin: 4px 0 0; font-size: 13px; color: #166534;">
                        Please keep your registration ID safe for checkposts across Uttarakhand.
                      </p>
                    </div>

                    ${
                      passUrl
                        ? `
                    <!-- Action Button -->
                    <div style="text-align: center; margin-bottom: 28px;">
                      <a href="${passUrl}" target="_blank" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35);">
                        📄 View & Download Digital Travel Pass &rarr;
                      </a>
                    </div>
                    `
                        : ""
                    }

                    <!-- Section 1: Vehicle & Journey -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #ea580c; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; margin-bottom: 12px; letter-spacing: 0.5px;">
                        🚘 Important Vehicle & Journey Details
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600; width: 45%;">Vehicle Number:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700; font-family: monospace;">${escapeHtml(registration.vehicleNumber || "-")}</td>
                        </tr>
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Vehicle Category:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700; text-transform: capitalize;">${escapeHtml(registration.vehicleType || "Private")}</td>
                        </tr>
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Authorized Route:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700;">${escapeHtml(registration.travelFrom || "-")} &rarr; ${escapeHtml(registration.travelTo || "-")}</td>
                        </tr>
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Travel Dates:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700;">${escapeHtml(registration.tourFrom || "-")} to ${escapeHtml(registration.tourTo || "-")}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Section 2: Driver & Contacts -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #ea580c; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; margin-bottom: 12px; letter-spacing: 0.5px;">
                        👤 Driver & Emergency Contacts
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600; width: 45%;">Driver / Owner Name:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700;">${escapeHtml(driverName || "-")}</td>
                        </tr>
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Contact Phone:</td>
                          <td style="padding: 7px 0; color: #0f172a; font-weight: 700;">${escapeHtml(driverPhone || "-")}</td>
                        </tr>
                        <tr>
                          <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Emergency Contact No:</td>
                          <td style="padding: 7px 0; color: #dc2626; font-weight: 800;">🚨 ${escapeHtml(registration.emergencyContactNo || "-")}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Section 3: Passenger List -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #ea580c; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; margin-bottom: 12px; letter-spacing: 0.5px;">
                        👥 Passenger Details (${registration.passengerDetails?.length || 0})
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-size: 13px;">
                        <thead>
                          <tr style="background-color: #fff7ed; color: #c2410c;">
                            <th style="padding: 8px 10px; text-align: center; border-bottom: 2px solid #ffedd5;">#</th>
                            <th style="padding: 8px 10px; text-align: left; border-bottom: 2px solid #ffedd5;">Passenger Name</th>
                            <th style="padding: 8px 10px; text-align: center; border-bottom: 2px solid #ffedd5;">Age</th>
                            <th style="padding: 8px 10px; text-align: center; border-bottom: 2px solid #ffedd5;">Gender</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${passengerRows}
                        </tbody>
                      </table>
                    </div>

                    <!-- Uttarakhand Emergency Helplines -->
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px 16px; margin-top: 24px;">
                      <div style="font-size: 13px; font-weight: 800; color: #991b1b; text-transform: uppercase; margin-bottom: 8px; text-align: center;">
                        📞 Uttarakhand Emergency Helplines
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px; text-align: center;">
                        <tr>
                          <td style="padding: 4px; font-weight: 700; color: #b91c1c;">Police: 112 / 100</td>
                          <td style="padding: 4px; font-weight: 700; color: #b91c1c;">Ambulance: 108</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px; font-weight: 700; color: #b91c1c;">UK SDRF: 1070</td>
                          <td style="padding: 4px; font-weight: 700; color: #b91c1c;">Women Helpline: 1090</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    &copy; 2026 Yatriguide | Devbhoomi Uttarakhand Tourism Portal<br/>
                    For 24x7 travel assistance, email: <a href="mailto:support@yatriguide.in" style="color: #ea580c; text-decoration: none;">support@yatriguide.in</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const sender = process.env.SMTP_FROM?.trim() || (user ? `"Yatriguide Uttarakhand" <${user}>` : "");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return { host, user, pass, sender, port, secure };
}

async function sendConfirmationEmail(registration, passUrl) {
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
    tls: { rejectUnauthorized: false },
  });

  const payload = buildPayload(registration);
  const htmlPayload = buildHtmlEmail(registration, passUrl);

  await transporter.sendMail({
    from: sender,
    to: registration.email,
    replyTo: sender,
    subject: `Registration Successful - Uttarakhand Travel Pass (${registration.id})`,
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

    const baseUrl = getNetworkBaseUrl(request);
    const passToken = encodePassData(registration);
    const passUrl = passToken
      ? `${baseUrl}/pass?id=${encodeURIComponent(registration.id)}&d=${encodeURIComponent(passToken)}`
      : `${baseUrl}/pass?id=${encodeURIComponent(registration.id)}`;

    let emailSent = false;
    try {
      emailSent = await sendConfirmationEmail(registration, passUrl);
    } catch (emailError) {
      console.error("Registration saved, but confirmation email failed", emailError);
    }

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
