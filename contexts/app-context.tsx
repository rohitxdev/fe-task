import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { string, z } from "zod";

const productSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	imageUrl: z.string().min(1),
	prices: z.array(
		z.object({
			id: string().min(1),
			productId: z.string().min(1),
			unitPrice: z.object({ amount: z.string().min(1), currencyCode: z.string().min(1) }),
		}),
	),
});

type Product = z.infer<typeof productSchema>;

interface AppContext {
	cart: Record<string, number>;
	addCartItem: (id: string) => void;
	updateCartItem: (id: string, quantity: number) => void;
	products: Product[];
}

const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<Record<string, number>>({});
	const [products, setProducts] = useState<Product[]>([]);
	const { isSignedIn } = useUser();
	const searchParams = useSearchParams();
	const isSignInRedirect = searchParams.get("isSignInRedirect") === "true";

	const fetchProducts = async () => {
		try {
			const response = await fetch("/api/products");
			const data = await response.json();
			const validProducts = productSchema.array().parse(data);
			setProducts(validProducts);
			localStorage.setItem("products", JSON.stringify(validProducts));
		} catch (error) {
			console.log(error);

			setProducts([]);
		}
	};

	const addCartItem = (id: string) => {
		setCart((item) => {
			item[id] = 1;
			if (isSignedIn) {
				fetch("/api/cart", { method: "POST", body: JSON.stringify({ cart: item }) });
			}
			localStorage.setItem("cart", JSON.stringify(item));
			return { ...item };
		});
	};

	const updateCartItem = (id: string, quantity: number) => {
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchProducts();
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
