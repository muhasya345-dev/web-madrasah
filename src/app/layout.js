import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SIM Madrasah | MTsN 3 Kota Tasikmalaya",
  description: "Sistem Informasi Manajemen MTs Negeri 3 Kota Tasikmalaya",
  icons: {
    icon: "/logo kemenag.png", // Ini akan memunculkan logo kamu di tab browser
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
