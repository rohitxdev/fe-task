"use client";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-100 p-6 text-black">
				<Toaster />
				<CartProvider>{children}</CartProvider>
			</body>
		</html>
	);
};

export default Layout;
