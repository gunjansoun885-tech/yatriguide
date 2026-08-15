import { readdir, readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

async function getRegistrations() {
  const registrationsDirectory = path.join(process.cwd(), "data", "registrations");

  try {
    const files = await readdir(registrationsDirectory);
    const registrations = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const filePath = path.join(registrationsDirectory, file);
          const content = await readFile(filePath, "utf8");
          return JSON.parse(content);
        }),
    );

    return registrations.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    return [];
  }
}

export default async function RegistrationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  const registrations = await getRegistrations();

  return (
    <main className="min-h-screen bg-stone-50 p-6 text-stone-800">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-stone-900">Saved Registrations</h1>
        <p className="mt-2 text-sm text-stone-600">Private owner-only view of all saved registration records.</p>

        <div className="mt-6 space-y-4">
          {registrations.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-sm">
              No registrations saved yet.
            </div>
          ) : (
            registrations.map((registration) => (
              <section key={registration.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-orange-700">{registration.id}</h2>
                  <span className="text-sm text-stone-500">
                    {registration.createdAt ? new Date(registration.createdAt).toLocaleString() : "-"}
                  </span>
                </div>

                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <span className="font-semibold">Private Registration Password:</span>{" "}
                  <span className="font-mono">{registration.registrationPassword || "-"}</span>
                </div>

                <pre className="overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs leading-6 text-emerald-300">
                  {JSON.stringify(registration, null, 2)}
                </pre>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
