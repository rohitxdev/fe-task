"use client";
import { Fallback } from "@/components/fallback";
import { Search } from "@/components/search";
import { useAppContext } from "@/contexts/app-context";
import { getRandomInt } from "@/utils/misc";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuMinus, LuPlus, LuShoppingCart, LuStar } from "react-icons/lu";

//Generate random ratings for products
const noOfRatings = new Array(30).fill(null);

for (let i = 0; i < noOfRatings.length; i++) {
	noOfRatings[i] = getRandomInt(100, 300);
}

const Page = () => {
	const { products, cart, addCartItem, updateCartItem } = useAppContext();
	const [search, setSearch] = useState("");
	const { isLoaded } = useUser();
	const regex = new RegExp(search, "i");
	const filteredProducts = products.filter((item) => regex.test(item.name));

	if (!isLoaded || products.length === 0) {
		return <Fallback />;
	}

	return (
		<main className="space-y-4">
			<h1 className="font-bold text-4xl">Products</h1>
			<Search onSearch={setSearch} />
			<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 max-sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
				{filteredProducts.map((item, i) => (
					<div
						className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-md duration-100 hover:shadow-xl max-sm:w-full max-sm:flex-row"
						key={item.id}
					>
						<Image
							className="aspect-square w-full self-center max-sm:w-2/5"
							src={item.imageUrl}
							alt={item.name}
							width={200}
							height={200}
						/>
						<div className="flex flex-col space-y-2 max-sm:w-40">
							<h3 className="line-clamp-2 font-semibold text-gray-600">{item.name}</h3>
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
								<span className="font-bold text-lg">&#36;{Number.parseInt(item.prices[0]!.unitPrice.amount) / 100}</span>
								{i % 3 === 0 && (
									<span className="rounded border-green-500 bg-green-300/50 px-1 py-0.5 font-bold text-green-600 text-xs">
										{i % 2 === 0 ? "30% off" : "50% off"}
									</span>
								)}
							</div>
							{cart[item.id] ? (
								<div className="flex h-10 w-full items-center justify-evenly rounded-md border border-gray-300 *:h-full">
									<button className="p-2" onClick={() => updateCartItem(item.id, cart[item.id] - 1)}>
										<LuMinus className="stroke-[4]" />
									</button>
									<span className="my-auto flex items-center text-center font-semibold">{cart[item.id]}</span>
									<button className="p-2" onClick={() => updateCartItem(item.id, cart[item.id] + 1)}>
										<LuPlus className="stroke-[4]" />
									</button>
								</div>
							) : (
								<button
									type="button"
									className="flex h-10 items-center justify-center gap-2 rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-700"
									onClick={() => {
										addCartItem(item.id);
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
