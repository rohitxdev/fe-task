import { paddle } from "@/utils/payments";

export const GET = async (req: Request) => {
	const productsCollection = paddle.products.list({ include: ["prices"] });
	const products = await productsCollection.next();
	return new Response(JSON.stringify(products), { status: 200, headers: { "Content-Type": "application/json" } });
};
