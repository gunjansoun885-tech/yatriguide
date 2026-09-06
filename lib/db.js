import { mkdir, readFile, readdir, rename, writeFile, unlink } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const dataDirectory = path.join(process.cwd(), "data");
const registrationsDirectory = path.join(dataDirectory, "registrations");
const registrationsFile = path.join(dataDirectory, "registrations.json");

// Create Supabase Client if credentials exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

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
    return Object.fromEntries(
      Object.entries(row).filter(([key]) => {
        const sourceKey = Object.keys(reg).find((candidate) => {
          const mappedKey = {
            id: "id",
            vehicle_number: "vehicleNumber",
            vehicle_type: "vehicleType",
            travel_from: "travelFrom",
            travel_from_other: "travelFromOther",
            travel_to: "travelTo",
            travel_to_other: "travelToOther",
            tour_from: "tourFrom",
            tour_to: "tourTo",
            driver_type: "driverType",
            owner_name: "ownerName",
            owner_age: "ownerAge",
            owner_phone: "ownerPhone",
            owner_whatsapp: "ownerWhatsapp",
            owner_aadhar: "ownerAadhar",
            owner_gender: "ownerGender",
            owner_blood_group: "ownerBloodGroup",
            driver_name: "driverName",
            vehicle_owner_name: "vehicleOwnerName",
            vehicle_owner_contact: "vehicleOwnerContact",
            driver_age: "driverAge",
            driver_phone: "driverPhone",
            driver_whatsapp: "driverWhatsapp",
            driver_aadhar: "driverAadhar",
            driver_gender: "driverGender",
            driver_blood_group: "driverBloodGroup",
            other_name: "otherName",
            other_age: "otherAge",
            other_phone: "otherPhone",
            other_whatsapp: "otherWhatsapp",
            other_gender: "otherGender",
            other_blood_group: "otherBloodGroup",
            emergency_contact_name: "emergencyContactName",
            emergency_contact_no: "emergencyContactNo",
            passenger_count: "passengerCount",
            passenger_details: "passengerDetails",
            stay_days: "stayDays",
            validity_date: "validityDate",
            goal_to_home: "goalToHome",
            blood_group: "bloodGroup",
            email: "email",
            message: "message",
            registration_password: "registrationPassword",
            password: "password",
            status: "status",
            created_at: "createdAt",
            updated_at: "updatedAt",
          }[key];
          return sourceKey && Object.prototype.hasOwnProperty.call(reg, sourceKey);
        });
        return Boolean(sourceKey);
      }),
    );
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
