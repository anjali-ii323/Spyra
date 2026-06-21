import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spyra AI | Threat Intelligence & Mobile Malware Detection",
  description: "Upload APK bundles to extract signatures, evaluate danger levels using a weighted static analysis rules engine, and review detailed threat explanation reports.",
  keywords: ["malware detection", "android security", "static analysis", "reverse engineering", "threat intelligence", "cybersecurity startup"],
  authors: [{ name: "Spyra AI Security Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${firaCode.variable} scroll-smooth`}>
      <body className="bg-[#030712] text-slate-200 antialiased font-sans min-h-screen">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

