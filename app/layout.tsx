"use client";
import { AppContextProvider } from "@/contexts/app-context";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Grotesk } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-100 p-6 text-black" style={spaceGrotesk.style}>
				<Toaster />
				<Suspense>
					<ClerkProvider>
						<AppContextProvider>
							<Nav />
							{children}
						</AppContextProvider>
					</ClerkProvider>
				</Suspense>
			</body>
		</html>
	);
};

export default Layout;
