import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StyleProvider } from "@/context/StyleContext";
import { VoiceProvider } from "@/context/VoiceContext";
import { StyleApplier } from "@/components/StyleApplier";
import { TranslationProvider } from "@/context/TranslationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessibility AI Interface",
  description: "AI-powered accessibility improvements with voice and gesture control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider>
          <StyleProvider>
            <VoiceProvider>
              <StyleApplier>
                {children}
              </StyleApplier>
            </VoiceProvider>
          </StyleProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}


