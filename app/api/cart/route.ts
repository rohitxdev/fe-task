import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const GET = async (req: Request) => {
	const { userId } = auth();
	if (!userId) return new Response(null, { status: 401 });

	const cart = ((await kv.get(userId)) as string | null) ?? {};

	return new Response(JSON.stringify(cart), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const POST = async (req: Request) => {
	const { userId } = auth();
	if (!userId) return new Response(null, { status: 401 });

	const body = await req.json();
	const cart = body?.cart;
	if (!cart) return new Response(null, { status: 422 });

	await kv.set(userId, JSON.stringify(cart));
	return new Response("OK", { status: 200 });
};
