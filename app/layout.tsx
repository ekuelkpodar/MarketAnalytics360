import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Market 360° Dashboard",
  description: "AI-powered industry intelligence dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-slate-50 text-slate-900 antialiased ${grotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
