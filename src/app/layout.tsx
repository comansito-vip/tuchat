import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { JsonLd, websiteJsonLd, organizationJsonLd } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const DESCRIPTION =
  "Salas de chat por países, ciudades y temas. Conoce gente y conversa en tiempo real.";

export const metadata: Metadata = {
  metadataBase: new URL("https://tuchat.org"),
  title: { default: "TuChat — Chat gratis en español", template: "%s · TuChat" },
  description: DESCRIPTION,
  // Sin title/description aquí: Next los deriva del title/description de cada
  // página, dando og:title y og:description propios por landing.
  openGraph: {
    type: "website",
    siteName: "TuChat",
    locale: "es_ES",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body className="font-sans">
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <div className="min-h-screen pb-16 lg:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
