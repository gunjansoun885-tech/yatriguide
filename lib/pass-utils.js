export function encodePassData(reg) {
  try {
    if (!reg || !reg.id) return "";
    const routeStops =
      Array.isArray(reg.routeStops) && reg.routeStops.length
        ? reg.routeStops
        : [reg.travelFrom, reg.travelTo].filter(Boolean);

    const compact = {
      id: reg.id,
      v: reg.vehicleNumber || "",
      vt: reg.vehicleType || "private",
      f: reg.travelFrom || (routeStops[0] || ""),
      t: reg.travelTo || (routeStops[routeStops.length - 1] || ""),
      rs: routeStops,
      tf: reg.tourFrom || "",
      tt: reg.tourTo || "",
      dt: reg.driverType || "owner",
      on: reg.ownerName || "",
      op: reg.ownerPhone || "",
      oa: reg.ownerAadhar || "",
      dn: reg.driverName || "",
      dp: reg.driverPhone || "",
      da: reg.driverAadhar || "",
      otherN: reg.otherName || "",
      otherP: reg.otherPhone || "",
      ec: reg.emergencyContactNo || "",
      p: (reg.passengerDetails || []).map((p) => ({
        n: p.name || "",
        a: p.age || "",
        g: p.gender || "Male",
      })),
      s: reg.status || "Approved",
      c: reg.createdAt || new Date().toISOString(),
    };
    return Buffer.from(JSON.stringify(compact)).toString("base64url");
  } catch {
    return "";
  }
}

export function decodePassData(token) {
  try {
    if (!token) return null;
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const c = JSON.parse(jsonStr);
    if (!c || !c.id) return null;

    const routeStops =
      Array.isArray(c.rs) && c.rs.length
        ? c.rs
        : [c.f, c.t].filter(Boolean);

    return {
      id: c.id,
      vehicleNumber: c.v || "",
      vehicleType: c.vt || "private",
      travelFrom: routeStops.length ? routeStops[0] : (c.f || ""),
      travelTo: routeStops.length ? routeStops[routeStops.length - 1] : (c.t || ""),
      routeStops,
      tourFrom: c.tf || "",
      tourTo: c.tt || "",
      driverType: c.dt || "owner",
      ownerName: c.on || "",
      ownerPhone: c.op || "",
      ownerAadhar: c.oa || "",
      driverName: c.dn || "",
      driverPhone: c.dp || "",
      driverAadhar: c.da || "",
      otherName: c.otherN || "",
      otherPhone: c.otherP || "",
      emergencyContactNo: c.ec || "",
      passengerDetails: (c.p || []).map((p) => ({
        name: p.n || "",
        age: p.a || "",
        gender: p.g || "Male",
      })),
      status: c.s || "Approved",
      createdAt: c.c || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
