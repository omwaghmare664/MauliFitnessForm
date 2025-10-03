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
  title: "Mauli Fitness Center",
  description: "Join our health & fitness program for transformation",
  openGraph: {
    title: "Mauli Fitness Centre",
    description: "Join our health & fitness program for transformation",
    url: "https://mauli-fitness-form.vercel.app/",
    siteName: "My Fitness",
    images: [
      {
        url: "https://mauli-fitness-form.vercel.app/logo.jpg", // <-- must be an absolute URL
        width: 400,
        height: 400,
        alt: "Fitness Transformation"
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mauli Fitness Centre",
    description: "Join our health & fitness program for transformation",
    images: ["https://mauli-fitness-form.vercel.app/logo.jpg"],
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
