import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegistrationById } from "@/lib/db";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    if (rawInput.includes("id=") || rawInput.includes("http")) {
      try {
        const parsedUrl = new URL(rawInput, "http://localhost");
        passId =
          parsedUrl.searchParams.get("id") ||
          parsedUrl.searchParams.get("registrationId") ||
          parsedUrl.pathname.split("/").pop() ||
          rawInput;
      } catch {
        const match = rawInput.match(/YS-\d{4}-[A-Z0-9]+/i);
        if (match) passId = match[0];
      }
    } else {
      const match = rawInput.match(/YS-\d{4}-[A-Z0-9]+/i);
      if (match) passId = match[0];
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

    // The pass is valid only during the inclusive trip date window.
    if (isApproved && (registration.tourFrom || registration.tourTo)) {
      const today = new Date();
      const tourStartDate = registration.tourFrom ? new Date(`${registration.tourFrom}T00:00:00`) : null;
      const tourEndDate = registration.tourTo ? new Date(`${registration.tourTo}T23:59:59.999`) : null;

      if (tourStartDate && !isNaN(tourStartDate.getTime()) && today < tourStartDate) {
        isValidPass = false;
        validityMessage = `Pass is valid from ${registration.tourFrom}.`;
      } else if (tourEndDate && !isNaN(tourEndDate.getTime()) && today > tourEndDate) {
        isValidPass = false;
        validityMessage = `Pass expired on ${registration.tourTo}.`;
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
