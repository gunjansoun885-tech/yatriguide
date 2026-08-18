import { NextResponse } from "next/server";
import { getRegistrationById, updateRegistration } from "@/lib/db";
import { encodePassData } from "@/lib/pass-utils";
import crypto from "crypto";
import os from "os";

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

export async function POST(request) {
  try {
    const body = await request.json();
    const registrationId = (body.registrationId || body.id)?.trim();
    const password = body.password?.trim();
    const newDestination = (body.newDestination || body.destination)?.trim();
    const newTourTo = body.newTourTo?.trim();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }
    if (!newDestination) {
      return NextResponse.json({ error: "Please enter or select a new destination to add." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Registration password is required to extend journey route." }, { status: 400 });
    }

    const existing = await getRegistrationById(registrationId);
    if (!existing) {
      return NextResponse.json({ error: "Registration not found for ID: " + registrationId }, { status: 404 });
    }

    // Verify Password
    const isPasswordValid =
      (existing.registrationPassword && existing.registrationPassword === password) ||
      (existing.password && verifyPassword(password, existing.password));

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password! Kripya sahi registration password dalein." },
        { status: 401 }
      );
    }

    // Determine current route stops
    const currentStops =
      Array.isArray(existing.routeStops) && existing.routeStops.length > 0
        ? [...existing.routeStops]
        : [existing.travelFrom, existing.travelTo].filter(Boolean);

    // Prevent duplicate consecutive stops
    if (
      currentStops.length === 0 ||
      currentStops[currentStops.length - 1].toLowerCase() !== newDestination.toLowerCase()
    ) {
      currentStops.push(newDestination);
    }

    const updates = {
      routeStops: currentStops,
      travelFrom: currentStops[0] || existing.travelFrom,
      travelTo: currentStops[currentStops.length - 1] || newDestination,
      tourTo: newTourTo || existing.tourTo,
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateRegistration(registrationId, updates);
    const baseUrl = getNetworkBaseUrl(request);
    const passToken = encodePassData(updated || { ...existing, ...updates });
    const passUrl = passToken
      ? `${baseUrl}/pass?id=${encodeURIComponent(registrationId)}&d=${encodeURIComponent(passToken)}`
      : `${baseUrl}/pass?id=${encodeURIComponent(registrationId)}`;

    return NextResponse.json({
      success: true,
      message: `Journey route successfully extended to ${newDestination}!`,
      registration: updated || { ...existing, ...updates },
      passUrl,
    });
  } catch (error) {
    console.error("Extend journey error:", error);
    return NextResponse.json({ error: "Unable to extend journey right now." }, { status: 500 });
  }
}
