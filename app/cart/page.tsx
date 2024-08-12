"use client";
import { useCart } from "@/contexts/cart-context";
import { useProducts } from "@/hooks/use-products";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuArrowLeft, LuCheckCircle, LuMinus, LuPlus, LuShoppingCart } from "react-icons/lu";

const Page = () => {
	const { cart, updateItem } = useCart();
	const products = useProducts();
	const [discountPercent, setDiscountPercent] = useState(0);
	const [promoCode, setPromoCode] = useState("");

	const cartItems = products.filter((item) => cart[item.id]);
	const subTotal = cartItems.reduce((acc, item) => acc + item.price * cart[item.id], 0);
	const total = ((subTotal * (100 - discountPercent)) / 100).toFixed(2);

	return (
		<main className="mx-auto space-y-6">
			<nav className="flex items-center justify-start">
				<Link aria-label="Back to products" href="/">
					<LuArrowLeft className="size-6 stroke-[3]" />
				</Link>
			</nav>
			<h1 className="text-center font-bold text-4xl">Cart</h1>
			<div className={`flex flex-wrap justify-center ${cartItems.length > 0 ? "items-start" : "items-stretch"} gap-6`}>
				<div className="flex w-full max-w-lg flex-col gap-4">
					{cartItems.length > 0 ? (
						cartItems.map((product, i) => (
							<div className="flex h-64 gap-4 rounded-md bg-white p-6 shadow-md" key={product.id}>
								<Image className="rounded object-contain p-2" src={product.image} width={150} height={200} alt={product.title} />
								<div className="space-y-2">
									<h2 className="line-clamp-2 font-semibold text-gray-600">{product.title}</h2>
									<p className="font-semibold text-lg">&#36;{product.price}</p>
									<div className="flex w-32 items-center rounded-md border border-gray-300 *:h-full">
										<button className="p-2" onClick={() => updateItem(product.id, cart[product.id] - 1)}>
											<LuMinus className="stroke-[3]" />
										</button>
										<p className="w-full items-center text-center leading-loose">{cart[product.id]}</p>
										<button className="p-2" onClick={() => updateItem(product.id, cart[product.id] + 1)}>
											<LuPlus className="stroke-[3]" />
										</button>
									</div>
									<small className="text-gray-500">Sold by Acme Ltd.</small>
									{i % 2 === 0 && (
										<small className="flex items-center gap-2">
											<LuCheckCircle />
											Free shipping
										</small>
									)}
									<small className="flex items-center gap-2">
										<LuCheckCircle />
										{i % 3 === 0 ? "Non-returnable" : "14 days returnable"}
									</small>
								</div>
							</div>
						))
					) : (
						<div className="flex h-full w-[240px] flex-col items-center justify-center gap-2 text-center text-gray-600">
							<LuShoppingCart className="size-4 stroke-[3]" />
							<p>Your cart is empty</p>
						</div>
					)}
				</div>
				<div className="w-full max-w-sm space-y-2 rounded-md bg-white p-6 shadow-md">
					<h2 className="font-semibold text-2xl">Checkout</h2>
					<small className="font-medium text-gray-400 text-xs">use 0FF10 for 10% off</small>
					<div className="flex items-center gap-2 pb-2">
						<input
							className="h-10 bg-gray-100 px-4 outline-black duration-100"
							type="text"
							placeholder="Promo code"
							onInput={(e) => setPromoCode(e.currentTarget.value)}
							value={promoCode}
						/>
						<button
							className="h-10 rounded bg-black px-4 py-2 font-semibold text-sm text-white"
							onClick={() => {
								if (!promoCode) return;
								if (promoCode === "OFF10") {
									setDiscountPercent(10);
									toast.success("Discount applied");
									setPromoCode("");
									return;
								}
								toast.error("Invalid promo code");
							}}
						>
							Apply
						</button>
					</div>
					<p className="text-gray-600 text-sm">
						Sub-total: <span className="font-semibold">&#36;{subTotal}</span>
					</p>
					<p className="text-gray-600 text-sm">
						Discount: <span className="font-semibold">{discountPercent}%</span>
					</p>
					<hr className="w-full border-gray-300 border-t" />
					<p>
						Total: <span className="font-bold text-xl">&#36;{total}</span>
					</p>
					<button
						className="!mt-4 w-full bg-black px-6 py-4 font-bold text-white uppercase disabled:cursor-not-allowed disabled:bg-gray-500"
						disabled={cartItems.length === 0}
						onClick={() => toast.success(`Placed order for $${total} successfully`)}
					>
						Place order
					</button>
				</div>
			</div>
		</main>
	);
};

export default Page;
