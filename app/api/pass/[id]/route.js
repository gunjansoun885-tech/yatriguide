import { NextResponse } from "next/server";
import { getRegistrationById, updateRegistration } from "@/lib/db";
import { encodePassData } from "@/lib/pass-utils";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !password) return false;
  if (typeof storedPassword === "string") {
    try {
      const bufA = Buffer.from(String(password), "utf8");
      const bufB = Buffer.from(String(storedPassword), "utf8");
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return password === storedPassword;
    }
  }
  if (storedPassword.hash && storedPassword.salt) {
    try {
      const computedHash = crypto.scryptSync(password, storedPassword.salt, 64).toString("hex");
      const bufA = Buffer.from(computedHash, "utf8");
      const bufB = Buffer.from(storedPassword.hash, "utf8");
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }
  return false;
}

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }

    const cleanId = id.trim().toUpperCase();
    const registration = await getRegistrationById(cleanId);

    if (!registration) {
      return NextResponse.json({ error: "Registration pass not found." }, { status: 404 });
    }

    const { registrationPassword, password, ...safeDetails } = registration;

    return NextResponse.json({ registration: safeDetails });
  } catch (error) {
    console.error("Pass API error", error);
    return NextResponse.json({ error: "Unable to load travel pass details." }, { status: 500 });
  }
}

async function handleRouteUpdate(request, params) {
  try {
    const resolvedParams = await params;
    const passId = resolvedParams?.id?.trim()?.toUpperCase();
    const body = await request.json();
    const registrationId = (body.registrationId || passId)?.trim();
    const password = body.password?.trim();
    const newDestination = (body.newDestination || body.destination)?.trim();
    const newTourTo = body.newTourTo?.trim();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json(
        { error: "Unauthorized. Registration password is required to extend journey route." },
        { status: 401 }
      );
    }
    if (!newDestination) {
      return NextResponse.json({ error: "Please enter or select a new destination to add." }, { status: 400 });
    }

    const existing = await getRegistrationById(registrationId);
    if (!existing) {
      return NextResponse.json({ error: "Registration not found for ID: " + registrationId }, { status: 404 });
    }

    const isPasswordValid =
      (existing.registrationPassword && verifyPassword(password, existing.registrationPassword)) ||
      (existing.password && verifyPassword(password, existing.password));

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Unauthorized: Incorrect registration password. Access restricted to the pass owner." },
        { status: 401 }
      );
    }

    const currentStops =
      Array.isArray(existing.routeStops) && existing.routeStops.length > 0
        ? [...existing.routeStops]
        : [existing.travelFrom, existing.travelTo].filter(Boolean);

    if (
      currentStops.length > 0 &&
      currentStops[currentStops.length - 1].toLowerCase() === newDestination.toLowerCase()
    ) {
      return NextResponse.json(
        { error: `Destination "${newDestination}" is already the latest stop on this route.` },
        { status: 400 }
      );
    }

    const priorRouteStr = currentStops.join(" → ") || existing.travelFrom || "Start";
    currentStops.push(newDestination);
    const newRouteStr = currentStops.join(" → ");

    const historyEntry = {
      from: priorRouteStr,
      addedDestination: newDestination,
      newRoute: newRouteStr,
      extendedAt: new Date().toISOString(),
    };

    const routeHistory = Array.isArray(existing.routeHistory)
      ? [...existing.routeHistory, historyEntry]
      : [historyEntry];

    const updates = {
      routeStops: currentStops,
      routeHistory,
      travelFrom: currentStops[0] || existing.travelFrom,
      travelTo: currentStops[currentStops.length - 1] || newDestination,
      tourTo: newTourTo || existing.tourTo,
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateRegistration(registrationId, updates);
    const passToken = encodePassData(updated || { ...existing, ...updates });

    return NextResponse.json({
      success: true,
      message: "Route extended successfully!",
      routeStops: currentStops,
      registration: updated || { ...existing, ...updates },
      passToken,
    });
  } catch (error) {
    console.error("Pass update route error", error);
    return NextResponse.json({ error: "Unable to extend route right now." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  return handleRouteUpdate(request, params);
}

export async function POST(request, { params }) {
  return handleRouteUpdate(request, params);
}

