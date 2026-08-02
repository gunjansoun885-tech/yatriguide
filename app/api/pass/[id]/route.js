import { NextResponse } from "next/server";
import { getRegistrationById } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

