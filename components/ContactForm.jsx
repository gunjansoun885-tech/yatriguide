"use client";

import React, { useState } from "react";
import { toDataURL } from "qrcode";

export default function ContactForm() {
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "private",
    ownerName: "",
    driverName: "",
    ownerPhone: "",
    ownerWhatsapp: "",
    driverPhone: "",
    driverWhatsapp: "",
    ownerAadhar: "",
    driverAadhar: "",
    stayDays: "",
    validityDate: "",
    goalToHome: "",
    bloodGroup: "",
    email: "",
    message: "",
  });
  const [qrCode, setQrCode] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = `Vehicle Number: ${form.vehicleNumber}
Vehicle Type: ${form.vehicleType}
Owner Name: ${form.ownerName}
Driver Name: ${form.driverName}
Owner Phone: ${form.ownerPhone}
Owner WhatsApp: ${form.ownerWhatsapp}
Driver Phone: ${form.driverPhone}
Driver WhatsApp: ${form.driverWhatsapp}
Owner Aadhar: ${form.ownerAadhar}
Driver Aadhar: ${form.driverAadhar}
Tourist Stay in Uttarakhand: ${form.stayDays}
Validity Date: ${form.validityDate}
Goal to Home: ${form.goalToHome}
Blood Group: ${form.bloodGroup}
Email: ${form.email}
Message: ${form.message}`;

    try {
      const qr = await toDataURL(payload.trim());
      setQrCode(qr);
      alert(`Thank you, ${form.ownerName || form.driverName}! Your details have been received.`);
    } catch (error) {
      console.error("QR code generation failed", error);
      alert("Your details were submitted, but the QR code could not be generated.");
    }

    setForm({
      vehicleNumber: "",
      vehicleType: "private",
      ownerName: "",
      driverName: "",
      ownerPhone: "",
      ownerWhatsapp: "",
      driverPhone: "",
      driverWhatsapp: "",
      ownerAadhar: "",
      driverAadhar: "",
      stayDays: "",
      validityDate: "",
      goalToHome: "",
      bloodGroup: "",
      email: "",
      message: "",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-stone-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gold-400 text-center">Travel & Vehicle Details</h2>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Registration Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-wide text-white/70">Type of Vehicle</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-white/90">
              <input
                type="radio"
                name="vehicleType"
                value="private"
                checked={form.vehicleType === "private"}
                onChange={handleChange}
                className="text-gold-500 focus:ring-gold-500"
              />
              Private
            </label>
            <label className="inline-flex items-center gap-2 text-white/90">
              <input
                type="radio"
                name="vehicleType"
                value="commercial"
                checked={form.vehicleType === "commercial"}
                onChange={handleChange}
                className="text-gold-500 focus:ring-gold-500"
              />
              Commercial
            </label>
          </div>
        </div>
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={form.driverName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <input
          type="tel"
          name="ownerPhone"
          placeholder="Owner Contact Number"
          value={form.ownerPhone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="tel"
          name="ownerWhatsapp"
          placeholder="Owner WhatsApp Number"
          value={form.ownerWhatsapp}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <input
          type="tel"
          name="driverPhone"
          placeholder="Driver Contact Number"
          value={form.driverPhone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="tel"
          name="driverWhatsapp"
          placeholder="Driver WhatsApp Number"
          value={form.driverWhatsapp}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <input
          type="text"
          name="ownerAadhar"
          placeholder="Owner Aadhar Card"
          value={form.ownerAadhar}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="driverAadhar"
          placeholder="Driver Aadhar Card"
          value={form.driverAadhar}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <input
          type="number"
          name="stayDays"
          placeholder="Tourist Stay in Uttarakhand (days)"
          value={form.stayDays}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="validityDate"
          value={form.validityDate}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 date-white-icon"
        />
        
        <style jsx global>{`
          input[type="date"].date-white-icon::-webkit-calendar-picker-indicator {
            filter: invert(1) brightness(2);
          }
          input[type="date"].date-white-icon::-webkit-input-placeholder {
            color: #a3a3a3;
          }
        `}</style>
        <input
          type="text"
          name="goalToHome"
          placeholder="Goal to Home"
          value={form.goalToHome}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-stone-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="" disabled>Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <textarea
        name="message"
        placeholder="Additional Message or Notes"
        rows={4}
        value={form.message}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-stone-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
      />

      <button
        type="submit"
        className="w-full py-3 bg-linear-to-r from-gold-500 to-amber-500 text-forest-950 font-bold rounded hover:from-gold-600 hover:to-amber-600 transition"
      >
        Submit Details
      </button>
    </form>

    {qrCode && (
      <div className="max-w-2xl mx-auto mt-6 p-6 bg-stone-900/80 rounded-xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold text-gold-400 text-center mb-4">QR Code Generated</h3>
        <p className="text-sm text-white/70 text-center mb-4">
          Scan this QR code to view the submitted travel and vehicle details.
        </p>
        <div className="flex justify-center">
          <img src={qrCode} alt="Submitted details QR code" className="w-64 h-64 object-contain rounded-xl bg-white p-2" />
        </div>
      </div>
    )}
    </>
  );
}
