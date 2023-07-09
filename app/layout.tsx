import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Immaculate Gridiron NFL",
  description: "The Immaculate Grid you know and love, NFL edition!",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Immacualte Gridiron</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
