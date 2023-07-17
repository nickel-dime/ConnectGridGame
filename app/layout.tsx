import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Connect Grid",
  description:
    "NFL, NBA, and MLB trivia based on the viral Immaculate Grid trend with different modes and settings!",
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
    <html lang="en" className="bg-background">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
        <title>Connect Grid</title>
        <meta property="og:title" content="Connect Grid" />
        <meta name="theme-color" content="#fff0e6" />
        <meta
          property="og:description"
          content="The Immaculate Grid you know and love, NFL edition!"
        />
        <meta
          property="og:image"
          content="https://immaculategridironnfl.com/preview.png"
        />
        <meta
          name="google-site-verification"
          content="-7S5tqXFj6Kh14vX0mGPFK4D3v4BENDUounTdzAtEfo"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
