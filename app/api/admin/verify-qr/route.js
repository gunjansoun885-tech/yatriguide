import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegistrationById } from "@/lib/db";
import { verifySessionToken } from "../check/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "yatriguide_admin_session";

async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function POST(request) {
  const session = await isAuthorized();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    let rawInput = body.code || body.passId || body.url || "";

    if (typeof rawInput !== "string" || !rawInput.trim()) {
      return NextResponse.json({ error: "Pass ID or QR Code payload is required." }, { status: 400 });
    }

    rawInput = rawInput.trim();

    // Extract pass ID if input is a full URL e.g. https://.../pass?id=YS-2026-XXXX
    let passId = rawInput;
    if (rawInput.includes("id=")) {
      try {
        const parsedUrl = new URL(rawInput, "http://localhost");
        passId = parsedUrl.searchParams.get("id") || rawInput;
      } catch {
        // use rawInput as passId fallback
      }
    }

    const cleanId = passId.trim().toUpperCase();
    const registration = await getRegistrationById(cleanId);

    if (!registration) {
      return NextResponse.json({
        verified: false,
        status: "Invalid",
        message: `No travel pass record found matching ID: ${cleanId}`,
      }, { status: 404 });
    }

    const isApproved = registration.status === "Approved";
    const isRejected = registration.status === "Rejected";
    const isPending = registration.status === "Pending" || !registration.status;

    let validityMessage = "Pass is valid and active.";
    let isValidPass = isApproved;

    if (isRejected) {
      validityMessage = "Pass application was REJECTED by Administration.";
    } else if (isPending) {
      validityMessage = "Pass application is PENDING approval.";
    }

    // Check if pass tour end date is in the past
    if (isApproved && registration.tourTo) {
      const tourEndDate = new Date(registration.tourTo);
      if (!isNaN(tourEndDate.getTime())) {
        tourEndDate.setHours(23, 59, 59, 999);
        if (new Date() > tourEndDate) {
          isValidPass = false;
          validityMessage = `Pass expired on ${registration.tourTo}.`;
        }
      }
    }

    const { registrationPassword, password, ...safeDetails } = registration;

    return NextResponse.json({
      verified: isValidPass,
      status: isValidPass ? "VALID" : isApproved ? "EXPIRED" : (registration.status || "PENDING").toUpperCase(),
      message: validityMessage,
      registration: safeDetails,
    });
  } catch (error) {
    console.error("QR Verification API error:", error);
    return NextResponse.json({ error: "Failed to process QR code verification." }, { status: 500 });
  }
}
