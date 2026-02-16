import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from "./_components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Red | Uruguay Exclusive",
  description: "Club privado de conexiones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#02040a] text-white`}
      >
        <div className="relative min-h-screen pb-20 overflow-hidden">
          {/* Fondo tipo landing: ciudad desenfocada con overlay oscuro y halos de color */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center scale-110 blur-3xl opacity-40" />
            <div className="absolute inset-0 bg-black/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_25%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_18%,rgba(255,255,255,0.05)_36%,rgba(255,255,255,0)_54%,rgba(255,255,255,0.05)_72%,rgba(255,255,255,0)_90%)] opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.7),transparent_55%)]" />
          </div>

          <div className="relative">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}