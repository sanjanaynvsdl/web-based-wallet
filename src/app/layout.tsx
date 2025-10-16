import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const manropeFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "wallet xyz.",
  description: "Create your wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manropeFont.variable} antialiased font-manrope`}
      >
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
