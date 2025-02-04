import type { Metadata } from "next";
import "./globals.css";
import { manRopeSans } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "AnycodeHub",
  description: "Nền tảng học lập trình trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manRopeSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
