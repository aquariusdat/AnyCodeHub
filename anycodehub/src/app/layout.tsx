import type { Metadata } from "next";
import "./globals.scss";
import { manrope } from "@/utils/fonts";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AnyCodeHub",
  description: "Nền tảng học lập trình trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClerkProvider>
        <html lang="en">
          <body className={`${manrope.variable} font-primary antialiased`}>
            {children}
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
