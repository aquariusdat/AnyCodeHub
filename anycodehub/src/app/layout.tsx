import "./globals.css";
import { Manrope } from "next/font/google";
import { AuthInit } from "@/components/auth/AuthInit";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/toaster";

const manrope = Manrope({
	subsets: ["latin", "vietnamese"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	title: "AnyCodeHub",
	description: "AnyCodeHub - Coding Tutorials and Courses",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-white font-sans antialiased dark:bg-gray-950",
					manrope.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthInit>
						{children}
						<Toaster />
					</AuthInit>
				</ThemeProvider>
			</body>
		</html>
	);
}
