import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Immaculate Gridiron NFL",
  description: "The Immaculate Grid you know and love, NFL edition!",
  icons: {
    icon: "../public/favicon.ico",
  },
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
        <title>Immaculate Gridiron</title>
        <meta property="og:title" content="Immaculate Gridiron NFL" />
        <meta
          property="og:description"
          content="The Immaculate Grid you know and love, NFL edition!"
        />
        <meta
          property="og:image"
          content="https://immaculategridironnfl.com/preview.png"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
