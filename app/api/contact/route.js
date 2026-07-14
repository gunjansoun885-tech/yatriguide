import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPayload(body, recipientEmail) {
  return [
    `Vehicle Number: ${body.vehicleNumber || "-"}`,
    `Vehicle Type: ${body.vehicleType || "-"}`,
    `Owner Name: ${body.ownerName || "-"}`,
    `Driver Name: ${body.driverName || "-"}`,
    `Owner Phone: ${body.ownerPhone || "-"}`,
    `Owner WhatsApp: ${body.ownerWhatsapp || "-"}`,
    `Driver Phone: ${body.driverPhone || "-"}`,
    `Driver WhatsApp: ${body.driverWhatsapp || "-"}`,
    `Owner Aadhar: ${body.ownerAadhar || "-"}`,
    `Driver Aadhar: ${body.driverAadhar || "-"}`,
    `Tourist Stay in Uttarakhand: ${body.stayDays || "-"}`,
    `Validity Date: ${body.validityDate || "-"}`,
    `Goal to Home: ${body.goalToHome || "-"}`,
    `Blood Group: ${body.bloodGroup || "-"}`,
    `Email: ${recipientEmail}`,
    `Message: ${body.message || "-"}`,
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

export async function POST(request) {
  try {
    const body = await request.json();
    const recipientEmail = body.email?.trim();

    if (!recipientEmail) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const payload = buildPayload(body, recipientEmail);
    const { host, user, pass, sender, port, secure } = getSmtpConfig();

    if (!user || !pass) {
      return NextResponse.json(
        {
          error:
            "SMTP is not configured on the server. Create a .env file and set SMTP_HOST, SMTP_USER, SMTP_PASS, and optionally SMTP_FROM/SMTP_PORT/SMTP_SECURE. See .env.example for a Gmail example.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      requireTLS: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: true,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: sender,
      to: recipientEmail,
      replyTo: sender,
      subject: "YatraSarthi travel and vehicle details",
      text: payload,
      html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(payload)}</pre>`,
    });

    return NextResponse.json({
      message: "Your details were sent securely to the email address you provided.",
    });
  } catch (error) {
    console.error("Email send failed", error);
    return NextResponse.json({ error: error.message || "Unable to send email securely." }, { status: 500 });
  }
}
