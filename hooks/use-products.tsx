import { useEffect, useState } from "react";
import { z } from "zod";

const productSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	price: z.number(),
	description: z.string().min(1),
	category: z.string().min(1),
	image: z.string().min(1),
	rating: z.object({
		rate: z.number(),
		count: z.number(),
	}),
});

const productsSchema = z.array(productSchema);

type Product = z.infer<typeof productSchema>;

const fetchProducts = async (callback: (products: Product[]) => void) => {
	const response = await fetch("https://fakestoreapi.com/products");
	const data = await response.json();
	callback(productsSchema.parse(data));
	return;
};

export const useProducts = () => {
	const [products, setProducts] = useState<z.infer<typeof productSchema>[]>([]);

	useEffect(() => {
		const localData = sessionStorage.getItem("products");
		if (localData) {
			setProducts(productsSchema.parse(JSON.parse(localData)));
			return;
		}

		fetchProducts((data) => {
			setProducts(data);
			sessionStorage.setItem("products", JSON.stringify(data));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return products;
};
