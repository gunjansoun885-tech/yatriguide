import ContactForm from "@/components/ContactForm";
import { MessageCircle, Phone, MapPin, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us - Yatriguide",
  description: "Share your travel and vehicle details for a safer Uttarakhand journey.",
};

const infoItems = [
  {
    title: "Call Us",
    description: "+91 98765 43210",
    icon: Phone,
  },
  {
    title: "Email",
    description: "support@yatriguide.in",
    icon: MessageCircle,
  },
  {
    title: "Visit Us",
    description: "123 Devbhoomi Road, Rishikesh, Uttarakhand",
    icon: MapPin,
  },
  {
    title: "Safety Support",
    description: "24/7 travel assistance and emergency response.",
    icon: ShieldCheck,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-stone-50 via-orange-50 to-stone-100 text-stone-700">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-center mx-auto mb-16">
            <p className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Contact
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-stone-800 sm:text-5xl">
              Get in touch with Yatriguide
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-stone-600">
              Send your vehicle and traveller details, and we’ll help you register safely for Uttarakhand travel. Your contact details are stored securely and used only for assistance.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-start">
            <div className="bg-white/80 border border-orange-100 shadow-2xl backdrop-blur-xl rounded-3xl p-8">
              <ContactForm />
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-stone-900/80 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-orange-600">Contact Details</h2>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  Reach out anytime for help with registration, travel planning, or emergency support during your Uttarakhand journey.
                </p>
                <div className="mt-8 space-y-4">
                  {infoItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-4 rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                          <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-orange-100 bg-orange-50/90 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-orange-600">Need quick help?</h2>
                <p className="mt-3 text-sm leading-7 text-stone-700">
                  Use your generated QR on arrival to speed up verification and get immediate support from our field team.
                </p>
                <div className="mt-6 space-y-4 text-sm text-stone-700">
                  <div className="rounded-2xl bg-white p-4 border border-orange-100 shadow-sm">
                    <p className="font-semibold text-orange-600">Emergency Hotline</p>
                    <p className="mt-1 text-stone-600">+91 12345 67890</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-orange-100 shadow-sm">
                    <p className="font-semibold text-orange-600">Office Hours</p>
                    <p className="mt-1 text-stone-600">Mon–Sun, 8 AM – 8 PM</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
