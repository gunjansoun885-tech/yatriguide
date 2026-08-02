import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAllRegistrations, updateRegistration, deleteRegistration, getDbStatus } from "@/lib/db";
import { verifySessionToken } from "../check/route";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "yatriguide_admin_session";

async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
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

async function sendStatusNotificationEmail(targetEmail, registration, status) {
  const { host, user, pass, sender, port, secure } = getSmtpConfig();
  if (!targetEmail || !user || !pass || user.includes("your-email")) {
    console.log(`[SMTP Notice] Email notification skipped for ${targetEmail} because SMTP_USER/SMTP_PASS are placeholders.`);
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

  const isApproved = status === "Approved";
  const subject = isApproved
    ? `🎉 Registration Approved! Yatriguide Travel Pass ID: ${registration.id}`
    : `⚠️ Yatriguide Registration Update for Vehicle ${registration.vehicleNumber || ""}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px; color: #333;">
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: ${isApproved ? "#16a34a" : "#dc2626"}; margin-top: 0;">
            ${isApproved ? "Yatriguide Travel Pass Approved" : "Registration Status Update"}
          </h2>
          <p style="font-size: 14px; color: #555;">
            Hello ${registration.ownerName || registration.driverName || "Valued Yatri"},
          </p>
          <p style="font-size: 14px; color: #555;">
            Your registration status for vehicle <strong>${registration.vehicleNumber || "-"}</strong> has been updated to:
            <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; background: ${isApproved ? "#dcfce7; color: #15803d" : "#fee2e2; color: #b91c1c"}">
              ${status}
            </span>
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="font-size: 13px; color: #444; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>Registration ID:</strong> ${registration.id}</p>
            <p style="margin: 4px 0;"><strong>Vehicle Number:</strong> ${registration.vehicleNumber || "-"}</p>
            <p style="margin: 4px 0;"><strong>Route:</strong> ${registration.travelFrom || "-"} &rarr; ${registration.travelTo || "-"}</p>
            <p style="margin: 4px 0;"><strong>Dates:</strong> ${registration.tourFrom || "-"} to ${registration.tourTo || "-"}</p>
          </div>
          ${
            isApproved
              ? `<div style="margin-top: 20px; text-align: center;">
                  <p style="font-size: 13px; color: #666;">Your Yatriguide Digital Pass is ready for presentation during travel.</p>
                </div>`
              : ""
          }
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #aaa; text-align: center;">&copy; 2026 Yatriguide Devbhoomi Travel Portal</p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: sender,
    to: targetEmail,
    subject,
    text: `Your Yatriguide registration status for ${registration.vehicleNumber} is now: ${status}. ID: ${registration.id}`,
    html,
  });

  return true;
}

// ----------------------------------------------------
// GET: Fetch all registrations (with search & filter)
// ----------------------------------------------------
export async function GET(request) {
  const session = await isAuthorized();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim()?.toLowerCase();
    const status = searchParams.get("status")?.trim();
    const sortBy = searchParams.get("sortBy")?.trim() || "createdAt";
    const sortOrder = searchParams.get("sortOrder")?.trim()?.toLowerCase() || "desc";

    let list = await getAllRegistrations();

    if (status && status !== "All") {
      list = list.filter((r) => r.status && r.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      list = list.filter((r) => {
        const vehicle = (r.vehicleNumber || "").toLowerCase();
        const owner = (r.ownerName || "").toLowerCase();
        const driver = (r.driverName || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        const id = (r.id || "").toLowerCase();
        const phone = (r.ownerPhone || r.driverPhone || "").toLowerCase();
        const route = `${r.travelFrom || ""} ${r.travelTo || ""}`.toLowerCase();
        return (
          vehicle.includes(search) ||
          owner.includes(search) ||
          driver.includes(search) ||
          email.includes(search) ||
          id.includes(search) ||
          phone.includes(search) ||
          route.includes(search)
        );
      });
    }

    // Sort list
    list.sort((a, b) => {
      let valA = a[sortBy] ?? "";
      let valB = b[sortBy] ?? "";

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return NextResponse.json({
      registrations: list,
      dbStatus: getDbStatus(),
      total: list.length,
    });
  } catch (error) {
    console.error("GET registrations error:", error);
    return NextResponse.json({ error: "Failed to load registrations." }, { status: 500 });
  }
}

// ----------------------------------------------------
// PUT: Update status / Edit registration data
// ----------------------------------------------------
export async function PUT(request) {
  const session = await isAuthorized();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }

    const payloadUpdates = { ...updates };
    if (status) payloadUpdates.status = status;

    const updated = await updateRegistration(id, payloadUpdates);
    if (!updated) {
      return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
    }

    // Send email notification if status was changed
    if (status && updated.email) {
      try {
        await sendStatusNotificationEmail(updated.email, updated, status);
      } catch (err) {
        console.warn("Status notification email failed:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${id} updated successfully.`,
      registration: updated,
    });
  } catch (error) {
    console.error("PUT registration error:", error);
    return NextResponse.json({ error: "Failed to update registration." }, { status: 500 });
  }
}

// ----------------------------------------------------
// DELETE: Delete registration record
// ----------------------------------------------------
export async function DELETE(request) {
  const session = await isAuthorized();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }

    const success = await deleteRegistration(id);
    if (!success) {
      return NextResponse.json({ error: "Unable to delete registration." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error("DELETE registration error:", error);
    return NextResponse.json({ error: "Failed to delete registration." }, { status: 500 });
  }
}
