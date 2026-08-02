import { randomBytes, scryptSync } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDirectory = path.join(process.cwd(), "data");
const registrationsDirectory = path.join(dataDirectory, "registrations");
const registrationsFile = path.join(dataDirectory, "registrations.json");

// In-memory OTP store (Persists during server lifecycle)
// Key: normalized identifier -> Value: { code, expiresAt, targetEmail, resetToken, verified }
if (!global._otpStore) {
  global._otpStore = new Map();
}
const otpStore = global._otpStore;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendOtpEmail(targetEmail, code) {
  const { host, user, pass, sender, port, secure } = getSmtpConfig();
  if (!targetEmail || !user || !pass || user.includes("your-email") || pass.includes("your-gmail")) {
    console.log(`[OTP Notice] Real email skipped because SMTP_USER/SMTP_PASS are placeholders. OTP code for ${targetEmail}: ${code}`);
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

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px; color: #333;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #ea580c; margin-top: 0;">Yatriguide Password Reset</h2>
          <p style="font-size: 14px; color: #555;">Use the following 6-digit verification code to reset your Yatriguide password:</p>
          <div style="background: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #ea580c;">${escapeHtml(code)}</span>
          </div>
          <p style="font-size: 12px; color: #888;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #aaa; text-align: center;">&copy; 2026 Yatriguide Devbhoomi Travel Portal</p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: sender,
    to: targetEmail,
    subject: `Yatriguide Password Reset Verification Code: ${code}`,
    text: `Your Yatriguide 6-digit verification code is: ${code}. Valid for 10 minutes.`,
    html,
  });

  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action || "UPDATE_PASSWORD";
    const identifier = body.identifier?.trim()?.toLowerCase();

    if (!identifier) {
      return NextResponse.json({ error: "Please enter your Email or Vehicle Registration Number." }, { status: 400 });
    }

    const cleanInput = identifier.replace(/[\s-]/g, "").toLowerCase();

    let registrations = [];
    try {
      registrations = JSON.parse(await readFile(registrationsFile, "utf8"));
      if (!Array.isArray(registrations)) registrations = [];
    } catch {
      registrations = [];
    }

    const reg = registrations.find((r) => {
      const normVehicle = (r.vehicleNumber || "").replace(/[\s-]/g, "").toLowerCase();
      const normId = (r.id || "").replace(/[\s-]/g, "").toLowerCase();
      const normEmail = (r.email || "").trim().toLowerCase();
      return (normVehicle && normVehicle === cleanInput) || (normId && normId === cleanInput) || (normEmail && normEmail === cleanInput);
    });

    const targetEmail = reg?.email?.trim() || (identifier.includes("@") ? identifier : null);

    if (action === "SEND_CODE") {
      if (!targetEmail) {
        return NextResponse.json(
          { error: `No registered email found for '${identifier}'. Please check your vehicle number or enter your registered email.` },
          { status: 404 }
        );
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      const resetToken = randomBytes(16).toString("hex");

      otpStore.set(cleanInput, {
        code,
        expiresAt,
        targetEmail,
        resetToken,
        verified: false,
      });
      if (targetEmail) {
        otpStore.set(targetEmail.toLowerCase(), {
          code,
          expiresAt,
          targetEmail,
          resetToken,
          verified: false,
        });
      }

      let emailSent = false;
      try {
        emailSent = await sendOtpEmail(targetEmail, code);
      } catch (err) {
        console.error("Failed to send OTP email", err);
      }

      const maskedEmail = targetEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "X".repeat(Math.max(b.length, 3)) + c);

      return NextResponse.json({
        success: true,
        message: emailSent
          ? `6-digit verification code sent to ${maskedEmail}!`
          : `Verification code generated for ${maskedEmail}!`,
        targetEmail: maskedEmail,
        demoCode: code,
      });
    }

    // ==========================================
    // ACTION 2: VERIFY CODE
    // ==========================================
    if (action === "VERIFY_CODE") {
      const codeInput = body.code?.trim();
      if (!codeInput) {
        return NextResponse.json({ error: "Please enter the 6-digit verification code." }, { status: 400 });
      }

      const otpRecord = otpStore.get(cleanInput) || otpStore.get(identifier);

      if (!otpRecord) {
        return NextResponse.json({ error: "No code requested for this account. Please click 'Send Verification Code'." }, { status: 400 });
      }

      if (Date.now() > otpRecord.expiresAt) {
        otpStore.delete(cleanInput);
        return NextResponse.json({ error: "Verification code expired. Please request a new code." }, { status: 400 });
      }

      if (otpRecord.code !== codeInput) {
        return NextResponse.json({ error: "Invalid verification code. Please check your code and try again." }, { status: 400 });
      }

      otpRecord.verified = true;
      otpStore.set(cleanInput, otpRecord);
      if (otpRecord.targetEmail) {
        otpStore.set(otpRecord.targetEmail.toLowerCase(), otpRecord);
      }

      return NextResponse.json({
        success: true,
        message: "Code verified successfully! Now create your new password.",
        resetToken: otpRecord.resetToken,
      });
    }

    // ==========================================
    // ACTION 3: UPDATE PASSWORD
    // ==========================================
    if (action === "UPDATE_PASSWORD") {
      const newPassword = body.newPassword?.trim();
      const confirmPassword = body.confirmPassword?.trim();
      const resetToken = body.resetToken?.trim();

      const otpRecord = otpStore.get(cleanInput) || otpStore.get(identifier);
      if (!otpRecord || !otpRecord.verified || (resetToken && otpRecord.resetToken !== resetToken)) {
        return NextResponse.json({ error: "Verification code not verified. Please verify code first." }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New password and confirm password do not match." }, { status: 400 });
      }

      const targetIndex = registrations.findIndex(
        (r) =>
          (r.email && r.email.toLowerCase() === identifier) ||
          (r.vehicleNumber && r.vehicleNumber.toLowerCase() === identifier) ||
          (r.id && r.id.toLowerCase() === identifier)
      );

      const passwordHash = hashPassword(newPassword);

      if (targetIndex !== -1) {
        registrations[targetIndex].registrationPassword = newPassword;
        registrations[targetIndex].password = passwordHash;

        await mkdir(dataDirectory, { recursive: true });
        const tmp = `${registrationsFile}.tmp`;
        await writeFile(tmp, JSON.stringify(registrations, null, 2), "utf8");
        await rename(tmp, registrationsFile);

        const regId = registrations[targetIndex].id;
        if (regId) {
          await mkdir(registrationsDirectory, { recursive: true });
          const singleFile = path.join(registrationsDirectory, `${regId}.json`);
          await writeFile(singleFile, JSON.stringify(registrations[targetIndex], null, 2), "utf8");
        }
      }

      // Cleanup OTP store
      otpStore.delete(identifier);

      return NextResponse.json({
        success: true,
        message: "Password updated successfully! You can now log in with your new password.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Password reset error", error);
    return NextResponse.json({ error: "Unable to reset password right now. Please try again." }, { status: 500 });
  }
}
