import { getRegistrationById } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PassClientView from "@/components/PassClientView";
import { toDataURL } from "qrcode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TravelPassPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const passId = resolvedSearchParams?.id || resolvedSearchParams?.registrationId;
  const isAuth =
    resolvedSearchParams?.auth === "1" ||
    resolvedSearchParams?.unmask === "1" ||
    resolvedSearchParams?.login === "1";

  if (!passId) {
    return (
      <>
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8 text-stone-800 print:bg-white print:p-0">
          <div className="mx-auto max-w-2xl pt-12 print:pt-0">
            <PassClientView error="No Registration ID provided in URL." />
          </div>
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </>
    );
  }

  const cleanPassId = String(passId).trim().toUpperCase();
  const registration = await getRegistrationById(cleanPassId);

  if (!registration) {
    return (
      <>
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8 text-stone-800 print:bg-white print:p-0">
          <div className="mx-auto max-w-2xl pt-12 print:pt-0">
            <PassClientView error={`Registration pass not found for ID: ${cleanPassId || "Unknown"}`} errorTitle="Invalid Travel Pass" />
          </div>
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </>
    );
  }

  let qrCodeUrl = "";
  if (String(registration.status || "").trim().toLowerCase() === "approved") {
    try {
      const origin = process.env.NEXT_PUBLIC_APP_URL || "";
      const baseUrl = origin || "https://www.yatriguide.in";
      const passUrl = `${baseUrl}/qr-result?id=${encodeURIComponent(String(registration.id).trim().toUpperCase())}`;
      qrCodeUrl = await toDataURL(passUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 320,
        color: { dark: "#000000", light: "#ffffff" },
      });
    } catch {}
  }

  const { registrationPassword, password, ...safeDetails } = registration;

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8 text-stone-800 print:bg-white print:p-0">
        <div className="mx-auto max-w-2xl pt-12 print:pt-0">
          <PassClientView registration={safeDetails} qrCodeUrl={qrCodeUrl} isInitialAuth={isAuth} />
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
