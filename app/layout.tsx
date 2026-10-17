import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Manrope,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { ScreenSizeNotice } from "@/components/screen-size-notice";
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haulr",
  description: "Ship, track, and estimate freight with Haulr.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        manrope.variable,
        jakarta.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ScreenSizeNotice />
      </body>
    </html>
  );
}
