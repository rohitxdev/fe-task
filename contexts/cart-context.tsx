import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
	cart: Record<number, number>;
	addItem: (id: number) => void;
	updateItem: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<Record<number, number>>({});

	const addItem = (id: number) => {
		setCart((item) => {
			item[id] = 1;
			localStorage.setItem("cart", JSON.stringify(item));
			return { ...item };
		});
	};

	const updateItem = (id: number, quantity: number) => {
		setCart((item) => {
			if (quantity > 0) {
				item[id] = quantity;
				localStorage.setItem("cart", JSON.stringify(item));
				return { ...item };
			}
			delete item[id];
			localStorage.setItem("cart", JSON.stringify(item));
			return { ...item };
		});
	};

	useEffect(() => {
		setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
	}, []);

	return <CartContext.Provider value={{ cart, addItem, updateItem }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
