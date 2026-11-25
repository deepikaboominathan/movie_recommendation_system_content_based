import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamil Movie Recommender",
  description: "Find Tamil movies based on shared genres, cast, crew and ratings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
