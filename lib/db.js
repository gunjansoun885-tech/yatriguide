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
  let fileList = await getFileRegistrations();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Map Supabase rows back to JS object
        const supabaseList = data.map((row) => mapRowToRegistration(row));
        return supabaseList;
      }
    } catch (err) {
      console.warn("Supabase fetch error, using file fallback:", err.message);
    }
  }

  return fileList;
}

// ----------------------------------------------------
// DB Method: GetRegistrationById
// ----------------------------------------------------
export async function getRegistrationById(id) {
  if (!id) return null;
  const cleanId = String(id).trim().toUpperCase();

  // 1. Instant Fast Path: Read single JSON file directly from disk (takes <1ms)
  try {
    const singleFilePath = path.join(registrationsDirectory, `${cleanId}.json`);
    const fileData = await readFile(singleFilePath, "utf8");
    const parsed = JSON.parse(fileData);
    if (parsed && parsed.id) {
      return parsed;
    }
  } catch {
    // Single file not found, fallback
  }

  // 2. Check main registrations.json
  try {
    const mainContent = await readFile(registrationsFile, "utf8");
    const list = JSON.parse(mainContent);
    if (Array.isArray(list)) {
      const match = list.find((r) => r.id && String(r.id).trim().toUpperCase() === cleanId);
      if (match) return match;
    }
  } catch {
    // Fallback to Supabase / all files
  }

  // 3. Check Supabase with a 2-second timeout
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await Promise.race([
        supabase.from("registrations").select("*").eq("id", cleanId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase query timeout")), 2000)),
      ]);

      if (!error && data) {
        return mapRowToRegistration(data);
      }
    } catch (err) {
      console.warn("Supabase getById notice:", err.message);
    }
  }

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

  // 1. Save locally in JSON DB (resilient to EPERM/EROFS)
  try {
    const list = await getFileRegistrations();
    const existingIdx = list.findIndex((r) => r.id === record.id);
    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...record };
    } else {
      list.unshift(record);
    }
    await saveFileRegistrations(list);
    await saveSingleFileRegistration(record);
  } catch (err) {
    console.warn("File DB save error:", err.message);
  }

  // 2. Save in Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const row = mapRegistrationToRow(record);
      const { error: supabaseErr } = await supabase.from("registrations").upsert(row);
      if (supabaseErr) {
        console.warn("Supabase save warning:", supabaseErr.message);
      }
    } catch (err) {
      console.warn("Supabase save exception:", err.message);
    }
  }

  return record;
}

// ----------------------------------------------------
// DB Method: UpdateRegistration
// ----------------------------------------------------
export async function updateRegistration(id, updates) {
  if (!id) return null;
  const cleanId = String(id).trim().toUpperCase();

  const list = await getFileRegistrations();
  const idx = list.findIndex((r) => r.id && String(r.id).trim().toUpperCase() === cleanId);

  let updatedRecord = null;

  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    updatedRecord = list[idx];
    await saveFileRegistrations(list);
    await saveSingleFileRegistration(updatedRecord);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const rowUpdates = mapRegistrationToRow(updates);
      rowUpdates.updated_at = new Date().toISOString();
      delete rowUpdates.id; // Do not overwrite primary key

      const { data } = await supabase
        .from("registrations")
        .update(rowUpdates)
        .eq("id", cleanId)
        .select()
        .single();

      if (data) {
        updatedRecord = mapRowToRegistration(data);
      }
    } catch (err) {
      console.warn("Supabase update error:", err.message);
    }
  }

  return updatedRecord;
}

// ----------------------------------------------------
// DB Method: DeleteRegistration
// ----------------------------------------------------
export async function deleteRegistration(id) {
  if (!id) return false;
  const cleanId = String(id).trim().toUpperCase();

  const list = await getFileRegistrations();
  const newList = list.filter((r) => !r.id || String(r.id).trim().toUpperCase() !== cleanId);
  await saveFileRegistrations(newList);

  try {
    const singleFile = path.join(registrationsDirectory, `${cleanId}.json`);
    await unlink(singleFile);
  } catch {
    // ignored
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("registrations").delete().eq("id", cleanId);
    } catch (err) {
      console.warn("Supabase delete error:", err.message);
    }
  }

  return true;
}

// ----------------------------------------------------
// Mappers: JS Object <-> Supabase DB Columns
// ----------------------------------------------------
function mapRegistrationToRow(reg) {
  return {
    id: reg.id,
    vehicle_number: reg.vehicleNumber,
    vehicle_type: reg.vehicleType,
    travel_from: reg.travelFrom,
    travel_from_other: reg.travelFromOther,
    travel_to: reg.travelTo,
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
}

function mapRowToRegistration(row) {
  return {
    id: row.id,
    vehicleNumber: row.vehicle_number || "",
    vehicleType: row.vehicle_type || "private",
    travelFrom: row.travel_from || "",
    travelFromOther: row.travel_from_other || "",
    travelTo: row.travel_to || "",
    travelToOther: row.travel_to_other || "",
    tourFrom: row.tour_from || "",
    tourTo: row.tour_to || "",
    driverType: row.driver_type || "owner",
    ownerName: row.owner_name || "",
    ownerAge: row.owner_age || "",
    ownerPhone: row.owner_phone || "",
    ownerWhatsapp: row.owner_whatsapp || "",
    ownerAadhar: row.owner_aadhar || "",
    ownerGender: row.owner_gender || "",
    ownerBloodGroup: row.owner_blood_group || "",
    driverName: row.driver_name || "",
    vehicleOwnerName: row.vehicle_owner_name || "",
    vehicleOwnerContact: row.vehicle_owner_contact || "",
    driverAge: row.driver_age || "",
    driverPhone: row.driver_phone || "",
    driverWhatsapp: row.driver_whatsapp || "",
    driverAadhar: row.driver_aadhar || "",
    driverGender: row.driver_gender || "",
    driverBloodGroup: row.driver_blood_group || "",
    otherName: row.other_name || "",
    otherAge: row.other_age || "",
    otherPhone: row.other_phone || "",
    otherWhatsapp: row.other_whatsapp || "",
    otherGender: row.other_gender || "",
    otherBloodGroup: row.other_blood_group || "",
    emergencyContactName: row.emergency_contact_name || "",
    emergencyContactNo: row.emergency_contact_no || "",
    passengerCount: row.passenger_count || "",
    passengerDetails: row.passenger_details || [],
    stayDays: row.stay_days || "",
    validityDate: row.validity_date || "",
    goalToHome: row.goal_to_home || "",
    bloodGroup: row.blood_group || "",
    email: row.email || "",
    message: row.message || "",
    registrationPassword: row.registration_password || "",
    password: row.password || null,
    status: row.status || "Pending",
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}
