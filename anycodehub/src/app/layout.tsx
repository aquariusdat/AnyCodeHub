import type { Metadata } from "next";
import "./globals.scss";
import { manrope } from "@/utils/fonts";
import { ThemeProvider } from "@/components/common/theme-provider";

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
      <html lang="en">
        <body className={`${manrope.variable} font-primary antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
