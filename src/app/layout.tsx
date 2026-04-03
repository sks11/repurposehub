import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { getStripeReturnRecoveryScript } from "@/lib/stripeReturnRecovery";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepurposeHub — One Text, Every Platform. Instantly.",
  description:
    "Transform any text into perfectly adapted content for 12+ social platforms in seconds. Keep your authentic voice everywhere. Powered by AI.",
  keywords: [
    "content repurposing",
    "AI content",
    "social media",
    "content marketing",
    "brand voice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script id="stripe-return-recovery" strategy="beforeInteractive">
          {getStripeReturnRecoveryScript()}
        </Script>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
