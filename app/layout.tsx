import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { AppWrapper } from "./wrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.connectgridgame.com/"),
  title: "Connect Grid",
  description:
    "NFL, NBA, and MLB trivia based on the viral Immaculate Grid trend with different modes and settings!",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.connectgridgame.com/",
    siteName: "Connect Grid",
    title: "Connect Grid",
    description:
      "Sports trivia based on the viral Immaculate Grid with unique modes and settings",
  },
  robots: {
    index: true,
    follow: true,
  },
  referrer: "no-referrer-when-downgrade",
  generator: "Next.js",
  keywords:
    "grid, immaculate, connect, mlb, nba, nfl, sports, trivia, connections",
  themeColor: "#fff0e6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
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
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
      </body>
    </html>
  );
}
