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

    // Verify Password against stored record
    const isPasswordValid =
      (existing.registrationPassword && verifyPassword(password, existing.registrationPassword)) ||
      (existing.password && verifyPassword(password, existing.password));

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Unauthorized: Incorrect registration password. Access restricted to the pass owner." },
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
    const baseUrl = getNetworkBaseUrl(request);
    const passToken = encodePassData(updated || { ...existing, ...updates });
    const passUrl = passToken
      ? `${baseUrl}/pass?id=${encodeURIComponent(registrationId)}&d=${encodeURIComponent(passToken)}`
      : `${baseUrl}/pass?id=${encodeURIComponent(registrationId)}`;

    return NextResponse.json({
      success: true,
      message: "Route extended successfully!",
      routeStops: currentStops,
      registration: updated || { ...existing, ...updates },
      passUrl,
    });
  } catch (error) {
    console.error("Extend journey error:", error);
    return NextResponse.json({ error: "Unable to extend journey right now." }, { status: 500 });
  }
}
