import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Immaculate Gridiron",
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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
