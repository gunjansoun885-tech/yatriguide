"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toDataURL } from "qrcode";
import CryptoJS from "crypto-js";
const SECRET_KEY = "YatraSarthi@2026";

const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const initialForm = {
  vehicleNumber: "",
  registrationPassword: "",
  confirmRegistrationPassword: "",
  vehicleType: "private",
  travelFrom: "",
  travelFromOther: "",
  travelTo: "",
  travelToOther: "",
  tourFrom: "",
  tourTo: "",
  driverType: "owner",
  ownerName: "",
  ownerAge: "",
  ownerPhone: "",
  ownerWhatsapp: "",
  ownerAadhar: "",
  ownerGender: "",
  ownerBloodGroup: "",
  driverName: "",
  vehicleOwnerName: "",
  vehicleOwnerContact: "",
  driverAge: "",
  driverPhone: "",
  driverWhatsapp: "",
  driverAadhar: "",
  driverGender: "",
  driverBloodGroup: "",
  otherName: "",
  otherAge: "",
  otherPhone: "",
  otherGender: "",
  otherBloodGroup: "",
  passengerCount: "",
  passengerDetails: [],
  stayDays: "",
  validityDate: "",
  goalToHome: "",
  bloodGroup: "",
  email: "",
  message: "",
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const travelLocations = ["Delhi", "Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Nainital", "Mussoorie", "Kedarnath", "Badrinath", "Gangotri", "Yamunotri", "Other"];
const adultAges = Array.from({ length: 83 }, (_, index) => index + 18);
const passengerAges = Array.from({ length: 101 }, (_, index) => index);

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [qrCode, setQrCode] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  const handleChange = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handlePassengerCountChange = ({ target: { value } }) => {
    const passengerCount = Number(value);

    setForm((previous) => ({
      ...previous,
      passengerCount: value,
      passengerDetails: Array.from({ length: passengerCount }, (_, index) =>
        previous.passengerDetails[index] || { name: "", age: "", gender: "" },
      ),
    }));
  };

  const handlePassengerChange = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      passengerDetails: previous.passengerDetails.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [field]: value } : passenger,
      ),
    }));
  };

  const handlePassengerDelete = (index) => {
    setForm((previous) => {
      const passengerDetails = previous.passengerDetails.filter((_, passengerIndex) => passengerIndex !== index);

      return {
        ...previous,
        passengerDetails,
        passengerCount: passengerDetails.length ? String(passengerDetails.length) : "",
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.registrationPassword !== form.confirmRegistrationPassword) {
      setStatusMessage({ type: "error", message: "Password and confirm password must match." });
      return;
    }

    setStatusMessage({ type: "loading", message: "Submitting registration..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.error || "Unable to submit registration right now.");

      const qrDetails = [
        `Registration ID: ${data.registrationId}`,
        `Vehicle: ${form.vehicleNumber}`,
        `Category: ${form.vehicleType}`,
        `Journey: ${form.travelFrom === "Other" ? form.travelFromOther : form.travelFrom} to ${form.travelTo === "Other" ? form.travelToOther : form.travelTo}`,
        `Dates: ${form.tourFrom} to ${form.tourTo}`,
        `Owner: ${form.ownerName}`,
        `Driver: ${form.driverType === "owner" ? form.ownerName : form.driverType === "driver" ? form.driverName : form.otherName}`,
         `driverPhone: ${form.driverType === "owner" ? form.ownerPhone : form.driverType === "driver" ? form.driverPhone : form.otherPhone}`,
         
      ].join("\n");
      const encryptedData = encryptData(qrDetails);

     setQrCode(await toDataURL(encryptedData));
      setRegistrationId(data.registrationId);
      setStatusMessage({
        type: "success",
        message: data.message || "Vehicle registration submitted successfully.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.message || "Your registration could not be submitted. Please try again.",
      });
    }
  };

  const statusStyle =
    statusMessage.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : statusMessage.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-orange-200 bg-orange-50 text-orange-700";

  return (
    <div className="mx-auto max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg shadow-stone-950/5"
      >
        <div className="border-b border-orange-100 bg-linear-to-r from-orange-600 to-amber-500 px-5 py-5 text-white sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">Yatra Sarthi</p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">Vehicle Travel Registration</h2>
          <p className="mt-1 text-xs text-orange-50">Complete the details below to register your journey.</p>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <section>
            <h3 className="text-sm font-bold text-stone-800">1. Vehicle details</h3>
            <div className="mt-3 space-y-3">
              <Field label="Vehicle registration number *">
                <input className={fieldClass} name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} placeholder="e.g. UK 07 AB 1234" required />
              </Field>
              <Field label="Create password *">
                <input className={fieldClass} type="password" name="registrationPassword" value={form.registrationPassword} onChange={handleChange} placeholder="Create a private password" autoComplete="new-password" minLength="6" required />
              </Field>
              <Field label="Confirm password *">
                <input className={fieldClass} type="password" name="confirmRegistrationPassword" value={form.confirmRegistrationPassword} onChange={handleChange} placeholder="Enter the password again" autoComplete="new-password" minLength="6" required />
              </Field>
              <fieldset>
                <legend className="text-sm font-medium text-stone-700">Vehicle category *</legend>
                <div className="mt-1.5 flex min-h-11 items-center gap-5 rounded-xl border border-stone-200 bg-white px-4">
                  {["private", "commercial"].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm capitalize text-stone-700">
                      <input type="radio" name="vehicleType" value={type} checked={form.vehicleType === type} onChange={handleChange} className="accent-orange-600" />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <p className="mt-2 text-xs text-stone-500"></p>
          </section>

          <section className="border-t border-stone-100 pt-5">
            <h3 className="text-sm font-bold text-stone-800">2. Journey details</h3>
            <div className="mt-3 space-y-3">
              <Field label="Travelling from *"><select className={fieldClass} name="travelFrom" value={form.travelFrom} onChange={handleChange} required><option value="">Select starting city</option>{travelLocations.map((location) => <option key={location}>{location}</option>)}</select></Field>
              {form.travelFrom === "Other" && <Field label="Starting city name *"><input className={fieldClass} name="travelFromOther" value={form.travelFromOther} onChange={handleChange} placeholder="Enter starting city" required /></Field>}
              <Field label="Travelling to *"><select className={fieldClass} name="travelTo" value={form.travelTo} onChange={handleChange} required><option value="">Select destination city</option>{travelLocations.map((location) => <option key={location}>{location}</option>)}</select></Field>
              {form.travelTo === "Other" && <Field label="Destination city name *"><input className={fieldClass} name="travelToOther" value={form.travelToOther} onChange={handleChange} placeholder="Enter destination city" required /></Field>}
              <Field label="Travel date — from *"><input className={fieldClass} type="date" name="tourFrom" value={form.tourFrom} onChange={handleChange} required /></Field>
              <Field label="Travel date — to *"><input className={fieldClass} type="date" name="tourTo" min={form.tourFrom} value={form.tourTo} onChange={handleChange} required /></Field>
            </div>
          </section>

          <section className="border-t border-stone-100 pt-5">
            <h3 className="text-sm font-bold text-stone-800">3. Who drives the vehicle?</h3>
            <fieldset className="mt-3 rounded-xl border border-stone-200 bg-stone-50/70 p-3">
              <legend className="sr-only">Select driver type</legend>
              <div className="space-y-3">
                {["owner", "driver", "other"].map((type) => (
                  <label key={type} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${form.driverType === type ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-200 bg-white text-stone-700 hover:border-orange-200"}`}>
                    <input type="radio" name="driverType" value={type} checked={form.driverType === type} onChange={handleChange} className="accent-orange-600" />
                    {type}
                  </label>
                ))}
              </div>

              {form.driverType === "owner" && <div className="mt-4">
                <h4 className="font-semibold text-orange-700">Owner details</h4>
                <div className="mt-2 space-y-2">
                  <Field label="Owner name *"><input className={fieldClass} name="ownerName" value={form.ownerName} onChange={handleChange} required /></Field>
                  <Field label="Owner age *"><select className={fieldClass} name="ownerAge" value={form.ownerAge} onChange={handleChange} required><option value="">Select age</option>{adultAges.map((age) => <option key={age}>{age}</option>)}</select></Field>
                  <Field label="Contact number *"><input className={fieldClass} type="tel" name="ownerPhone" value={form.ownerPhone} onChange={handleChange} inputMode="numeric" required /></Field>
                  <Field label="Gender *"><select className={fieldClass} name="ownerGender" value={form.ownerGender} onChange={handleChange} required><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></Field>
                  <Field label="Blood group *"><select className={fieldClass} name="ownerBloodGroup" value={form.ownerBloodGroup} onChange={handleChange} required><option value="">Select blood group</option>{bloodGroups.map((group) => <option key={group}>{group}</option>)}</select></Field>
                  <Field label="Aadhaar number"><input className={fieldClass} name="ownerAadhar" value={form.ownerAadhar} onChange={handleChange} inputMode="numeric" maxLength="12" /></Field>
                </div>
              </div>}

              {form.driverType === "driver" && <div className="mt-4">
                <h4 className="font-semibold text-orange-700">Driver details</h4>
                <div className="mt-2 space-y-2">
                  <Field label="Vehicle owner name *"><input className={fieldClass} name="vehicleOwnerName" value={form.vehicleOwnerName} onChange={handleChange} required /></Field>
                  <Field label="Vehicle owner contact number *"><input className={fieldClass} type="tel" name="vehicleOwnerContact" value={form.vehicleOwnerContact} onChange={handleChange} inputMode="numeric" required /></Field>
                  <Field label="Driver name *"><input className={fieldClass} name="driverName" value={form.driverName} onChange={handleChange} required /></Field>
                  <Field label="Driver age *"><select className={fieldClass} name="driverAge" value={form.driverAge} onChange={handleChange} required><option value="">Select age</option>{adultAges.map((age) => <option key={age}>{age}</option>)}</select></Field>
                  <Field label="Driver contact number *"><input className={fieldClass} type="tel" name="driverPhone" value={form.driverPhone} onChange={handleChange} inputMode="numeric" required /></Field>
                  <Field label="Driver gender *"><select className={fieldClass} name="driverGender" value={form.driverGender} onChange={handleChange} required><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></Field>
                  <Field label="Driver blood group *"><select className={fieldClass} name="driverBloodGroup" value={form.driverBloodGroup} onChange={handleChange} required><option value="">Select blood group</option>{bloodGroups.map((group) => <option key={group}>{group}</option>)}</select></Field>
                  <Field label="Aadhaar number"><input className={fieldClass} name="driverAadhar" value={form.driverAadhar} onChange={handleChange} inputMode="numeric" maxLength="12" /></Field>
                </div>
              </div>}

              {form.driverType === "other" && <div className="mt-4">
                <h4 className="font-semibold text-orange-700">Other person&apos;s details</h4>
                <div className="mt-2 space-y-2">
                  <Field label="Name *"><input className={fieldClass} name="otherName" value={form.otherName} onChange={handleChange} required /></Field>
                  <Field label="Age *"><select className={fieldClass} name="otherAge" value={form.otherAge} onChange={handleChange} required><option value="">Select age</option>{adultAges.map((age) => <option key={age}>{age}</option>)}</select></Field>
                  <Field label="Contact number *"><input className={fieldClass} type="tel" name="otherPhone" value={form.otherPhone} onChange={handleChange} inputMode="numeric" required /></Field>
                  <Field label="Gender *"><select className={fieldClass} name="otherGender" value={form.otherGender} onChange={handleChange} required><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></Field>
                  <Field label="Blood group *"><select className={fieldClass} name="otherBloodGroup" value={form.otherBloodGroup} onChange={handleChange} required><option value="">Select blood group</option>{bloodGroups.map((group) => <option key={group}>{group}</option>)}</select></Field>
                </div>
              </div>}
            </fieldset>
          </section>

          <section className="border-t border-stone-100 pt-5">
            <h3 className="text-sm font-bold text-stone-800">4. Additional information</h3>
            <div className="mt-3 space-y-3">
              <Field label="Number of passengers *">
                <select className={fieldClass} name="passengerCount" value={form.passengerCount} onChange={handlePassengerCountChange} required>
                  <option value="">Select passengers (maximum 50)</option>
                  {Array.from({ length: 50 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </Field>
              <Field label="Email address"><input className={fieldClass} type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" /></Field>
            </div>

            {form.passengerDetails.length > 0 && <div className="mt-4 space-y-3">
              <h4 className="font-semibold text-orange-700">Passenger details</h4>
              {form.passengerDetails.map((passenger, index) => (
                <div key={index} className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-stone-800">Passenger {index + 1}</p>
                    <button type="button" onClick={() => handlePassengerDelete(index)} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200" aria-label={`Delete passenger ${index + 1}`} title="Delete passenger">
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <Field label="Name *"><input className={fieldClass} value={passenger.name} onChange={(event) => handlePassengerChange(index, "name", event.target.value)} required /></Field>
                    <Field label="Age *"><select className={fieldClass} value={passenger.age} onChange={(event) => handlePassengerChange(index, "age", event.target.value)} required><option value="">Select age</option>{passengerAges.map((age) => <option key={age}>{age}</option>)}</select></Field>
                    <Field label="Gender *"><select className={fieldClass} value={passenger.gender} onChange={(event) => handlePassengerChange(index, "gender", event.target.value)} required><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></Field>
                  </div>
                </div>
              ))}
            </div>}
             <Field label="emergency contact number *"><input className={fieldClass} type="tel" name="emergency contact no." value={form.emergencyContactno} onChange={handleChange} inputMode="numeric" required /></Field>
            <Field label="Any additional note"><textarea className={fieldClass} name="message" rows="3" value={form.message} onChange={handleChange} placeholder="Add any helpful travel information" /></Field>
          </section>

          {statusMessage.message && <p className={`rounded-xl border px-4 py-3 text-sm ${statusStyle}`}>{statusMessage.message}</p>}
          <button type="submit" className="w-full rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200">Submit registration</button>
        </div>
      </form>

      {qrCode && <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-lg shadow-stone-950/5">
        <h3 className="text-lg font-bold text-stone-800">Registration QR code</h3>
        <p className="mt-1 text-sm text-stone-600">Registration ID: <span className="font-semibold text-orange-700">{registrationId}</span></p>
        <p className="mt-1 text-sm text-stone-600">Keep this QR code for your travel registration.</p>
        <Image src={qrCode} alt="Vehicle registration QR code" width={224} height={224} unoptimized className="mx-auto mt-4 rounded-xl bg-white p-2" />
      </div>}
    </div>
  );
}
