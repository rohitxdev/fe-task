"use client";
import { Cart } from "@/components/cart";
import { Search } from "@/components/search";
import { useCart } from "@/contexts/cart-context";
import { useProducts } from "@/hooks/use-products";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuMinus, LuPlus, LuShoppingCart, LuStar } from "react-icons/lu";

const getRandomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const noOfRatings = new Array(40).fill(null);
for (let i = 0; i < noOfRatings.length; i++) {
	noOfRatings[i] = getRandomInt(100, 300);
}

const Page = () => {
	const [search, setSearch] = useState<string>("");
	const regex = new RegExp(search, "i");
	const products = useProducts();
	const filteredProducts = products.filter((item) => regex.test(item.title));
	const { cart, addItem, updateItem } = useCart();

	return (
		<main className="space-y-6">
			<nav className="flex justify-end">
				<Cart />
			</nav>
			<h1 className="font-bold text-4xl">Products</h1>
			<Search onSearch={setSearch} />
			<div className="mx-auto flex flex-wrap gap-4">
				{filteredProducts.map((item, i) => (
					<div className="flex w-64 flex-col gap-4 rounded-md bg-white p-6 shadow-md max-sm:w-full max-sm:flex-row" key={item.id}>
						<Image className="aspect-square w-full self-center max-sm:w-2/5" src={item.image} alt={item.title} width={200} height={200} />
						<div className="flex flex-col space-y-2">
							<h3 className="line-clamp-2 font-semibold text-gray-600">{item.title}</h3>
							<div className="flex items-center gap-1">
								{new Array(5).fill(null).map((_, idx) => (
									<LuStar
										className={`border-none stroke-yellow-600 ${idx < (i % 3 === 0 ? 5 : 4) && "fill-yellow-600"}`}
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={idx}
									/>
								))}
								<span className="ml-1 font-semibold text-gray-600 text-sm">{noOfRatings[i]}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-bold text-lg">&#36;{item.price}</span>
								{i % 3 === 0 && (
									<span className="rounded border-green-500 bg-green-300/50 px-1 py-0.5 font-bold text-green-600 text-xs">
										{i % 2 === 0 ? "30% off" : "50% off"}
									</span>
								)}
							</div>
							{cart[item.id] ? (
								<div className="flex h-10 w-full items-center justify-evenly rounded-md border border-gray-300 *:h-full">
									<button className="p-2" onClick={() => updateItem(item.id, cart[item.id] - 1)}>
										<LuMinus className="stroke-[4]" />
									</button>
									<span className="my-auto flex items-center text-center font-semibold">{cart[item.id]}</span>
									<button className="p-2" onClick={() => updateItem(item.id, cart[item.id] + 1)}>
										<LuPlus className="stroke-[4]" />
									</button>
								</div>
							) : (
								<button
									type="button"
									className="flex h-10 items-center justify-center gap-2 rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-700"
									onClick={() => {
										addItem(item.id);
										toast.success("Added item to cart", { style: { fontWeight: "600" } });
									}}
								>
									Add to cart <LuShoppingCart className="size-4" />
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Page;
