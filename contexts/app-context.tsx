import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

const productSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	price: z.number(),
	description: z.string().min(1),
	image: z.string().min(1),
});

type Product = z.infer<typeof productSchema>;

const fetchProducts = async (callback: (products: Product[]) => void) => {
	try {
		const response = await fetch("https://fakestoreapi.in/api/products?limit=30");
		const data = await response.json();
		callback(productSchema.array().parse(data.products));
	} catch (error) {
		callback([]);
	}
};

interface AppContext {
	cart: Record<number, number>;
	addCartItem: (id: number) => void;
	updateCartItem: (id: number, quantity: number) => void;
	products: Product[];
}

const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<Record<number, number>>({});
	const [products, setProducts] = useState<Product[]>([]);
	const { isSignedIn } = useUser();
	const searchParams = useSearchParams();
	const isSignInRedirect = searchParams.get("isSignInRedirect") === "true";

	const addCartItem = (id: number) => {
		setCart((item) => {
			item[id] = 1;
			if (isSignedIn) {
				fetch("/api/cart", { method: "POST", body: JSON.stringify({ cart: item }) });
			}
			localStorage.setItem("cart", JSON.stringify(item));
			return { ...item };
		});
	};

	const updateCartItem = (id: number, quantity: number) => {
		setCart((item) => {
			if (quantity > 0) {
				item[id] = quantity;
			} else {
				delete item[id];
			}
			if (isSignedIn) {
				fetch("/api/cart", { method: "POST", body: JSON.stringify({ cart: item }) });
			}
			localStorage.setItem("cart", JSON.stringify(item));
			return { ...item };
		});
	};

	useEffect(() => {
		const fetchCart = async () => {
			if (isSignedIn) {
				const res = await fetch("/api/cart");
				const data = await res.json();
				const localCart = JSON.parse(localStorage.getItem("cart") || "{}");
				if (isSignInRedirect) {
					//Sync local cart with server cart on sign in.
					const updatedCart = { ...localCart, ...data };
					setCart(updatedCart);
					localStorage.setItem("cart", JSON.stringify(updatedCart));
					await fetch("/api/cart", { method: "POST", body: JSON.stringify({ cart: updatedCart }) });
				} else {
					setCart(data);
					localStorage.setItem("cart", JSON.stringify(data));
				}
			} else {
				setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
			}
		};

		fetchCart();
	}, [isSignedIn, isSignInRedirect]);

	useEffect(() => {
		//Cache products in local storage
		const localData = localStorage.getItem("products");
		if (localData) {
			setProducts(productSchema.array().parse(JSON.parse(localData)));
			return;
		}

		fetchProducts((data) => {
			setProducts(data);
			localStorage.setItem("products", JSON.stringify(data));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AppContext.Provider value={{ products, cart, addCartItem, updateCartItem }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within a AppContext");
	}
	return context;
};
