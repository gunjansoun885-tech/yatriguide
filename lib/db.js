import { mkdir, readFile, readdir, rename, writeFile, unlink } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const dataDirectory = path.join(process.cwd(), "data");
const registrationsDirectory = path.join(dataDirectory, "registrations");
const registrationsFile = path.join(dataDirectory, "registrations.json");

// Create Supabase Client if credentials exist
const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL
)?.trim();
const supabaseKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY
)?.trim();

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith("http"));
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

function ensureDatabaseAvailable() {
  if (!isSupabaseConfigured && process.env.NODE_ENV === "production") {
    throw new Error("Supabase database configuration is required in production.");
  }
}

export function getDbStatus() {
  return {
    isSupabaseConfigured,
    supabaseUrl: isSupabaseConfigured ? supabaseUrl : null,
  };
}

// ----------------------------------------------------
// Helper: File DB Operations
// ----------------------------------------------------
async function getFileRegistrations() {
  try {
    await mkdir(dataDirectory, { recursive: true });
    await mkdir(registrationsDirectory, { recursive: true });
  } catch {
    // Ignore directory creation error on read-only environments
  }

  try {
    const mainContent = await readFile(registrationsFile, "utf8");
    const list = JSON.parse(mainContent);
    if (Array.isArray(list)) return list;
  } catch {
    // fallback to single files
  }

  try {
    const files = await readdir(registrationsDirectory);
    const registrations = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const filePath = path.join(registrationsDirectory, file);
          const content = await readFile(filePath, "utf8");
          return JSON.parse(content);
        })
    );
    return registrations.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    return [];
  }
}

async function saveFileRegistrations(registrations) {
  try {
    await mkdir(dataDirectory, { recursive: true });
    const content = JSON.stringify(registrations, null, 2);
    const temporaryFile = `${registrationsFile}.tmp`;

    try {
      await writeFile(temporaryFile, content, "utf8");
      try {
        await rename(temporaryFile, registrationsFile);
      } catch {
        // Fallback if rename fails (e.g. Windows file lock EPERM)
        await writeFile(registrationsFile, content, "utf8");
        try {
          await unlink(temporaryFile);
        } catch {}
      }
    } catch {
      await writeFile(registrationsFile, content, "utf8");
    }
  } catch (err) {
    console.warn("Local file DB save notice:", err.message);
  }
}

async function saveSingleFileRegistration(registration) {
  if (!registration?.id) return;
  try {
    await mkdir(registrationsDirectory, { recursive: true });
    const singleFile = path.join(registrationsDirectory, `${registration.id}.json`);
    await writeFile(singleFile, JSON.stringify(registration, null, 2), "utf8");
  } catch (err) {
    console.warn("Single file save notice:", err.message);
  }
}

// ----------------------------------------------------
// DB Method: GetAllRegistrations
// ----------------------------------------------------
export async function getAllRegistrations() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Supabase registration fetch failed: ${error.message}`);
    }

    return (data || []).map((row) => mapRowToRegistration(row));
  }

  ensureDatabaseAvailable();
  return getFileRegistrations();
}

// ----------------------------------------------------
// DB Method: GetRegistrationById
// ----------------------------------------------------
export async function getRegistrationById(id) {
  if (!id) return null;
  const cleanId = String(id).trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("registrations").select("*").eq("id", cleanId).maybeSingle();
    if (error) {
      throw new Error(`Supabase registration lookup failed: ${error.message}`);
    }
    return data ? mapRowToRegistration(data) : null;
  }

  ensureDatabaseAvailable();
  try {
    const singleFilePath = path.join(registrationsDirectory, `${cleanId}.json`);
    const fileData = await readFile(singleFilePath, "utf8");
    const parsed = JSON.parse(fileData);
    if (parsed && parsed.id) return parsed;
  } catch {}

  try {
    const mainContent = await readFile(registrationsFile, "utf8");
    const list = JSON.parse(mainContent);
    if (Array.isArray(list)) {
      const match = list.find((r) => r.id && String(r.id).trim().toUpperCase() === cleanId);
      if (match) return match;
    }
  } catch {}

  const all = await getFileRegistrations();
  return all.find((r) => r.id && String(r.id).trim().toUpperCase() === cleanId) || null;
}

// ----------------------------------------------------
// DB Method: SaveRegistration
// ----------------------------------------------------
export async function saveRegistration(registrationData) {
  const record = {
    ...registrationData,
    status: registrationData.status || "Pending",
    createdAt: registrationData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("registrations")
      .upsert(mapRegistrationToRow(record))
      .select()
      .single();
    if (error) {
      throw new Error(`Supabase registration save failed: ${error.message}`);
    }
    return mapRowToRegistration(data);
  }

  ensureDatabaseAvailable();
  const list = await getFileRegistrations();
  const existingIdx = list.findIndex((r) => r.id === record.id);
  if (existingIdx !== -1) list[existingIdx] = { ...list[existingIdx], ...record };
  else list.unshift(record);
  await saveFileRegistrations(list);
  await saveSingleFileRegistration(record);
  return record;
}

// ----------------------------------------------------
// DB Method: UpdateRegistration
// ----------------------------------------------------
export async function updateRegistration(id, updates) {
  if (!id) return null;
  const cleanId = String(id).trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    const rowUpdates = mapRegistrationToRow(updates, true);
    rowUpdates.updated_at = new Date().toISOString();
    delete rowUpdates.id;
    const { data, error } = await supabase
      .from("registrations")
      .update(rowUpdates)
      .eq("id", cleanId)
      .select()
      .maybeSingle();
    if (error) {
      throw new Error(`Supabase registration update failed: ${error.message}`);
    }
    return data ? mapRowToRegistration(data) : null;
  }

  ensureDatabaseAvailable();
  const list = await getFileRegistrations();
  const idx = list.findIndex((r) => r.id && String(r.id).trim().toUpperCase() === cleanId);
  if (idx === -1) return null;
  const updatedRecord = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  list[idx] = updatedRecord;
  await saveFileRegistrations(list);
  await saveSingleFileRegistration(updatedRecord);
  return updatedRecord;
}

// ----------------------------------------------------
// DB Method: DeleteRegistration
// ----------------------------------------------------
export async function deleteRegistration(id) {
  if (!id) return false;
  const cleanId = String(id).trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("registrations").delete().eq("id", cleanId);
    if (error) {
      throw new Error(`Supabase registration delete failed: ${error.message}`);
    }
    return true;
  }

  ensureDatabaseAvailable();
  const list = await getFileRegistrations();
  const newList = list.filter((r) => !r.id || String(r.id).trim().toUpperCase() !== cleanId);
  await saveFileRegistrations(newList);
  try {
    await unlink(path.join(registrationsDirectory, `${cleanId}.json`));
  } catch {}
  return true;
}

// ----------------------------------------------------
// Mappers: JS Object <-> Supabase DB Columns
// ----------------------------------------------------
function mapRegistrationToRow(reg, partial = false) {
  const routeStops =
    Array.isArray(reg.routeStops) && reg.routeStops.length
      ? reg.routeStops
      : [reg.travelFrom, reg.travelTo].filter(Boolean);

  const row = {
    id: reg.id,
    vehicle_number: reg.vehicleNumber,
    vehicle_type: reg.vehicleType,
    travel_from: reg.travelFrom || (routeStops[0] || ""),
    travel_from_other: reg.travelFromOther,
    travel_to: reg.travelTo || (routeStops[routeStops.length - 1] || ""),
    travel_to_other: reg.travelToOther,
    tour_from: reg.tourFrom,
    tour_to: reg.tourTo,
    driver_type: reg.driverType,
    owner_name: reg.ownerName,
    owner_age: reg.ownerAge,
    owner_phone: reg.ownerPhone,
    owner_whatsapp: reg.ownerWhatsapp,
    owner_aadhar: reg.ownerAadhar,
    owner_gender: reg.ownerGender,
    owner_blood_group: reg.ownerBloodGroup,
    driver_name: reg.driverName,
    vehicle_owner_name: reg.vehicleOwnerName,
    vehicle_owner_contact: reg.vehicleOwnerContact,
    driver_age: reg.driverAge,
    driver_phone: reg.driverPhone,
    driver_whatsapp: reg.driverWhatsapp,
    driver_aadhar: reg.driverAadhar,
    driver_gender: reg.driverGender,
    driver_blood_group: reg.driverBloodGroup,
    other_name: reg.otherName,
    other_age: reg.otherAge,
    other_phone: reg.otherPhone,
    other_whatsapp: reg.otherWhatsapp,
    other_gender: reg.otherGender,
    other_blood_group: reg.otherBloodGroup,
    emergency_contact_name: reg.emergencyContactName,
    emergency_contact_no: reg.emergencyContactNo,
    passenger_count: reg.passengerCount,
    passenger_details: reg.passengerDetails,
    stay_days: reg.stayDays,
    validity_date: reg.validityDate,
    goal_to_home: reg.goalToHome,
    blood_group: reg.bloodGroup,
    email: reg.email,
    message: reg.message,
    registration_password: reg.registrationPassword,
    password: reg.password,
    status: reg.status || "Pending",
    created_at: reg.createdAt || new Date().toISOString(),
    updated_at: reg.updatedAt || new Date().toISOString(),
  };

  if (partial) {
    const columnNames = {
      id: "id",
      vehicleNumber: "vehicle_number",
      vehicleType: "vehicle_type",
      travelFrom: "travel_from",
      travelFromOther: "travel_from_other",
      travelTo: "travel_to",
      travelToOther: "travel_to_other",
      tourFrom: "tour_from",
      tourTo: "tour_to",
      driverType: "driver_type",
      ownerName: "owner_name",
      ownerAge: "owner_age",
      ownerPhone: "owner_phone",
      ownerWhatsapp: "owner_whatsapp",
      ownerAadhar: "owner_aadhar",
      ownerGender: "owner_gender",
      ownerBloodGroup: "owner_blood_group",
      driverName: "driver_name",
      vehicleOwnerName: "vehicle_owner_name",
      vehicleOwnerContact: "vehicle_owner_contact",
      driverAge: "driver_age",
      driverPhone: "driver_phone",
      driverWhatsapp: "driver_whatsapp",
      driverAadhar: "driver_aadhar",
      driverGender: "driver_gender",
      driverBloodGroup: "driver_blood_group",
      otherName: "other_name",
      otherAge: "other_age",
      otherPhone: "other_phone",
      otherWhatsapp: "other_whatsapp",
      otherGender: "other_gender",
      otherBloodGroup: "other_blood_group",
      emergencyContactName: "emergency_contact_name",
      emergencyContactNo: "emergency_contact_no",
      passengerCount: "passenger_count",
      passengerDetails: "passenger_details",
      stayDays: "stay_days",
      validityDate: "validity_date",
      goalToHome: "goal_to_home",
      bloodGroup: "blood_group",
      email: "email",
      message: "message",
      registrationPassword: "registration_password",
      password: "password",
      status: "status",
      createdAt: "created_at",
      updatedAt: "updated_at",
    };

    const partialRow = {};
    for (const [sourceKey, columnName] of Object.entries(columnNames)) {
      if (Object.prototype.hasOwnProperty.call(reg, sourceKey)) {
        partialRow[columnName] = row[columnName];
      }
    }
    return partialRow;
  }

  return row;
}

function mapRowToRegistration(row) {
  const stops =
    Array.isArray(row.route_stops) && row.route_stops.length
      ? row.route_stops
      : Array.isArray(row.routeStops) && row.routeStops.length
        ? row.routeStops
        : [row.travel_from || row.travelFrom, row.travel_to || row.travelTo].filter(Boolean);

  const history = Array.isArray(row.route_history)
    ? row.route_history
    : Array.isArray(row.routeHistory)
      ? row.routeHistory
      : [];

  return {
    id: row.id,
    vehicleNumber: row.vehicle_number || row.vehicleNumber || "",
    vehicleType: row.vehicle_type || row.vehicleType || "private",
    travelFrom: stops[0] || row.travel_from || row.travelFrom || "",
    travelFromOther: row.travel_from_other || row.travelFromOther || "",
    travelTo: stops[stops.length - 1] || row.travel_to || row.travelTo || "",
    travelToOther: row.travel_to_other || row.travelToOther || "",
    routeStops: stops,
    routeHistory: history,
    tourFrom: row.tour_from || row.tourFrom || "",
    tourTo: row.tour_to || row.tourTo || "",
    driverType: row.driver_type || row.driverType || "owner",
    ownerName: row.owner_name || row.ownerName || "",
    ownerAge: row.owner_age || row.ownerAge || "",
    ownerPhone: row.owner_phone || row.ownerPhone || "",
    ownerWhatsapp: row.owner_whatsapp || row.ownerWhatsapp || "",
    ownerAadhar: row.owner_aadhar || row.ownerAadhar || "",
    ownerGender: row.owner_gender || row.ownerGender || "",
    ownerBloodGroup: row.owner_blood_group || row.ownerBloodGroup || "",
    driverName: row.driver_name || row.driverName || "",
    vehicleOwnerName: row.vehicle_owner_name || row.vehicleOwnerName || "",
    vehicleOwnerContact: row.vehicle_owner_contact || row.vehicleOwnerContact || "",
    driverAge: row.driver_age || row.driverAge || "",
    driverPhone: row.driver_phone || row.driverPhone || "",
    driverWhatsapp: row.driver_whatsapp || row.driverWhatsapp || "",
    driverAadhar: row.driver_aadhar || row.driverAadhar || "",
    driverGender: row.driver_gender || row.driverGender || "",
    driverBloodGroup: row.driver_blood_group || row.driverBloodGroup || "",
    otherName: row.other_name || row.otherName || "",
    otherAge: row.other_age || row.otherAge || "",
    otherPhone: row.other_phone || row.otherPhone || "",
    otherWhatsapp: row.other_whatsapp || row.otherWhatsapp || "",
    otherGender: row.other_gender || row.otherGender || "",
    otherBloodGroup: row.other_blood_group || row.otherBloodGroup || "",
    emergencyContactName: row.emergency_contact_name || row.emergencyContactName || "",
    emergencyContactNo: row.emergency_contact_no || row.emergencyContactNo || "",
    passengerCount: row.passenger_count || row.passengerCount || "",
    passengerDetails: row.passenger_details || row.passengerDetails || [],
    stayDays: row.stay_days || row.stayDays || "",
    validityDate: row.validity_date || row.validityDate || "",
    goalToHome: row.goal_to_home || row.goalToHome || "",
    bloodGroup: row.blood_group || row.bloodGroup || "",
    email: row.email || "",
    message: row.message || "",
    registrationPassword: row.registration_password || row.registrationPassword || "",
    password: row.password || null,
    status: row.status || "Pending",
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}
