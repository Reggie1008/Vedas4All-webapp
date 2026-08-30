import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const TAGLINE = "Taking the Vedas to every home in South Africa.";

export const metadata: Metadata = {
  metadataBase: new URL("https://learn.vedas4all.org"),
  title: {
    default: "Vedas4All — Learn to Chant",
    template: "%s — Vedas4All",
  },
  description:
    "Sanskrit text with svara marks, transliteration, word-by-word meaning, and audio at two speeds — for the Vedas4All chanting classes.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vedas4All — Learn to Chant",
    description: TAGLINE,
    url: "https://learn.vedas4all.org",
    siteName: "Vedas4All",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080B10",
};

/* Applies the stored theme before first paint so a light-mode user
   never sees a dark flash on load. */
const THEME_INIT = `try{var t=localStorage.getItem('v4a-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;var s=localStorage.getItem('v4a-font-scale');if(s)document.documentElement.style.setProperty('--font-scale',s);}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
