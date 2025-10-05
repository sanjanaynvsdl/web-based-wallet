import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
