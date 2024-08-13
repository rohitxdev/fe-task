"use client";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const epilogue = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-100 p-6 text-black" style={epilogue.style}>
				<Toaster />
				<CartProvider>{children}</CartProvider>
			</body>
		</html>
	);
};

export default Layout;
