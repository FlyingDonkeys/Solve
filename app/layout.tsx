import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solve",
  description: "Focused H2 Mathematics practice with curated questions and step-by-step solutions.",
  verification: {
    google: "sfhN38Ye9w3lEHz1fCJMkT9O667Xyw-W1-CleDeThFg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("antialiased", "dark", geistMono.variable, inter.variable)}
    >
      <body className="flex min-h-dvh flex-col overflow-y-scroll">
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
