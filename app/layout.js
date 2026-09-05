import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Yatriguide | Discover the Majestic Beauty of Uttarakhand",
  description: "Explore the ultimate tourism guide of Uttarakhand. Discover majestic mountains, sacred temples, thrilling adventure sports, and high-altitude trekking in the Land of Gods.",
  keywords: "Uttarakhand Tourism, Kedarnath, Mussoorie, Rishikesh, Nainital, Auli, Jim Corbett, Chardham Yatra, Trekking",
  authors: [{ name: "Yatriguide Tourism" }],
  openGraph: {
    title: "Yatriguide - Uttarakhand Tourism",
    description: "Explore mountains, temples, adventures and breathtaking landscapes of Uttarakhand.",
    url: "https://uttarakhand-tourism.com",
    siteName: "Yatriguide",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans bg-stone-50 text-stone-800 min-h-screen overflow-x-hidden selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
