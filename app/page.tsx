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
					<div className="flex aspect-[3/4] w-64 flex-col space-y-2 rounded-md bg-white p-6 shadow-md max-sm:w-full" key={item.id}>
						<Image className="aspect-square w-full self-center" src={item.image} alt={item.title} width={150} height={200} />
						<h3 className="line-clamp-2 font-semibold text-gray-600">{item.title}</h3>
						<div className="flex items-center gap-1">
							{new Array(i % 4 === 0 ? 3 : 4).fill(null).map((_, idx) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<LuStar className="border-none fill-yellow-500 stroke-yellow-600" key={idx} />
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
								<p className="items-center text-center font-semibold leading-loose">{cart[item.id]}</p>
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
				))}
			</div>
		</main>
	);
};

export default Page;
