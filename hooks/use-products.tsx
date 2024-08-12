import { useEffect, useState } from "react";
import { z } from "zod";
import fallBackProducts from "./products.json";

const productSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	price: z.number(),
	description: z.string().min(1),
	image: z.string().min(1),
});

const productsSchema = z.array(productSchema);

type Product = z.infer<typeof productSchema>;

const fetchProducts = async (callback: (products: Product[]) => void) => {
	try {
		const response = await fetch("https://fakestoreapi.in/api/products?limit=30");
		const data = await response.json();
		callback(productsSchema.parse(data.products));
	} catch (error) {
		callback(fallBackProducts);
	}
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
			console.log(data);
			setProducts(data);
			sessionStorage.setItem("products", JSON.stringify(data));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return products;
};
