import { randomBytes, scryptSync } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDirectory = path.join(process.cwd(), "data");
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

async function saveRegistration(registration) {
  await mkdir(dataDirectory, { recursive: true });

  let registrations = [];
  try {
    registrations = JSON.parse(await readFile(registrationsFile, "utf8"));
    if (!Array.isArray(registrations)) registrations = [];
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  registrations.push(registration);
  const temporaryFile = `${registrationsFile}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(registrations, null, 2), "utf8");
  await rename(temporaryFile, registrationsFile);
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
  if (!registration.email || !user || !pass) return false;

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
  await transporter.sendMail({
    from: sender,
    to: registration.email,
    replyTo: sender,
    subject: `YatraSarthi registration ${registration.id}`,
    text: payload,
    html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(payload)}</pre>`,
  });
  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.vehicleNumber?.trim()) {
      return NextResponse.json({ error: "Vehicle registration number is required." }, { status: 400 });
    }
    if (!body.registrationPassword || body.registrationPassword !== body.confirmRegistrationPassword) {
      return NextResponse.json({ error: "Please enter matching passwords." }, { status: 400 });
    }

    const { registrationPassword, confirmRegistrationPassword, travelFromOther, travelToOther, ...details } = body;
    const password = hashPassword(registrationPassword);
    const registration = {
      ...details,
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

    return NextResponse.json({
      message: emailSent ? "Registration saved and confirmation email sent." : "Registration saved successfully.",
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Registration save failed", error);
    return NextResponse.json({ error: "Unable to save registration right now." }, { status: 500 });
  }
}
