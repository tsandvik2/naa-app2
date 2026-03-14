import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NÅ – Hva gjør vi nå?",
  description: "Slutt å scrolle. Begynn å leve.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NÅ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-black" style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(25, 25, 35, 0.97)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: "700",
            },
          }}
        />
      </body>
    </html>
  );
}
