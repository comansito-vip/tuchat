import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LayoutShell } from "@/components/layout/LayoutShell";
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
  "Chat gratis en español sin registro. Salas de chat online por países, ciudades y temáticas para chatear con gente, hacer amigos y ligar en tiempo real.";

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
    // Fallback para páginas sin openGraph propio (webchat, admin…). Las demás
    // extienden OG_BASE porque Next reemplaza este objeto, no lo fusiona.
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "TuChat — Chat gratis en español" },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      // SVG escalable para navegadores modernos; favicon.ico (src/app) cubre los
      // antiguos vía convención de Next. Todo deriva del mismo logo "TC".
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  // Sin viewport-fit=cover, env(safe-area-inset-*) vale 0 en iPhone con notch
  // y el padding de la nav inferior/LayoutShell no protege del home indicator.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${jakarta.variable} ${bricolage.variable}`}>
      <head>
        {/* Las banderas se sirven desde flagcdn.com en muchos listados: abrir la
            conexión por adelantado reduce la latencia de las primeras imágenes. */}
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        {/* Las imágenes de noticias se sirven desde Unsplash. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <LayoutShell>{children}</LayoutShell>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
