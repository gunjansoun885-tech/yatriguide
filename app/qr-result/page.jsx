import { getRegistrationById } from "@/lib/db";
import { decodePassData } from "@/lib/pass-utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PassClientView from "@/components/PassClientView";
import { toDataURL } from "qrcode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QrResultPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const passId = resolvedSearchParams?.id || resolvedSearchParams?.registrationId;
  const passToken = resolvedSearchParams?.d || resolvedSearchParams?.token || resolvedSearchParams?.p;

  if (!passId && !passToken) {
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

  let registration = passId ? await getRegistrationById(passId) : null;

  if (!registration && passToken) {
    registration = decodePassData(passToken);
  }

  if (!registration) {
    return (
      <>
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8 text-stone-800 print:bg-white print:p-0">
          <div className="mx-auto max-w-2xl pt-12 print:pt-0">
            <PassClientView error={`Registration pass not found for ID: ${passId || "Unknown"}`} />
          </div>
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </>
    );
  }

  let qrCodeUrl = "";
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "";
    const passUrl = origin
      ? `${origin}/pass?id=${encodeURIComponent(registration.id)}`
      : `/pass?id=${encodeURIComponent(registration.id)}`;
    qrCodeUrl = await toDataURL(passUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {}

  const { registrationPassword, password, ...safeDetails } = registration;

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 lg:px-8 text-stone-800 print:bg-white print:p-0">
        <div className="mx-auto max-w-2xl pt-12 print:pt-0">
          <PassClientView registration={safeDetails} qrCodeUrl={qrCodeUrl} />
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
