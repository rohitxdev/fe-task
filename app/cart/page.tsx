"use client";
import { Fallback } from "@/components/fallback";
import { useAppContext } from "@/contexts/app-context";
import { SignInButton, useUser } from "@clerk/nextjs";
import { CheckoutEventNames, type Paddle, initializePaddle } from "@paddle/paddle-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LuCheckCircle, LuMinus, LuPlus, LuShoppingCart, LuTrash2 } from "react-icons/lu";

const Page = () => {
	const { cart, updateCartItem, products } = useAppContext();
	const [discountPercent, setDiscountPercent] = useState(0);
	const [promoCode, setPromoCode] = useState("");
	const { isSignedIn, isLoaded } = useUser();
	const paddle = useRef<Paddle | null>(null);

	const cartItems = products.filter((item) => cart[item.id]);
	const subTotal = cartItems.reduce((acc, item) => acc + (Number.parseInt(item.prices[0]!.unitPrice.amount) / 100) * cart[item.id], 0);
	const total = ((subTotal * (100 - discountPercent)) / 100).toFixed(2);

	useEffect(() => {
		const initPaddle = async () => {
			const res = await initializePaddle({
				token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
				eventCallback: (e) => {
					if (e.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
						paddle?.current?.Checkout.close();
						for (const item in cart) {
							updateCartItem(item, 0);
						}
						setDiscountPercent(0);
						toast.success("Placed order successfully");
					}
				},
			});
			if (!res) return;

			if (process.env.VERCEL_ENV === "development") {
				res.Environment.set("sandbox");
			}
			paddle.current = res;
		};

		initPaddle();
	}, [cart, updateCartItem]);

	if (!isLoaded || products.length === 0) {
		return <Fallback />;
	}

	return (
		<main className="mx-auto space-y-6">
			<h1 className="text-center font-bold text-4xl">Cart</h1>
			<div className={`flex flex-wrap justify-center ${cartItems.length > 0 ? "items-start" : "items-stretch"} gap-6`}>
				<div className="flex w-full max-w-lg flex-col gap-4">
					{cartItems.length > 0 ? (
						cartItems.map((product, i) => (
							<div className="flex gap-4 rounded-md bg-white p-6 shadow-md" key={product.id}>
								<Image
									className="contain m-auto aspect-square h-full max-w-[40%] p-2"
									src={product.imageUrl}
									width={200}
									height={200}
									alt={product.name}
								/>
								<div className="max-h-64 space-y-2">
									<h2 className="line-clamp-2 font-semibold text-gray-600">{product.name}</h2>
									<p className="font-semibold text-lg">&#36;{Number.parseInt(product.prices[0]!.unitPrice.amount) / 100}</p>
									<div className="flex items-center gap-4">
										<div className="flex w-32 items-center rounded-md border border-gray-300 *:h-full">
											<button className="p-2" onClick={() => updateCartItem(product.id, cart[product.id] - 1)}>
												<LuMinus className="stroke-[3]" />
											</button>
											<p className="w-full items-center text-center leading-loose">{cart[product.id]}</p>
											<button className="p-2" onClick={() => updateCartItem(product.id, cart[product.id] + 1)}>
												<LuPlus className="stroke-[3]" />
											</button>
										</div>
										<button className="p-0.5" onClick={() => updateCartItem(product.id, 0)}>
											<LuTrash2 className="size-5" />
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
						<div className="mx-auto flex h-full w-[240px] flex-col items-center justify-center gap-2 text-center text-gray-600">
							<LuShoppingCart className="size-4 stroke-[3]" />
							<p>Your cart is empty</p>
						</div>
					)}
				</div>
				<div className="w-full max-w-sm space-y-2 rounded-md bg-white p-6 shadow-md">
					<h2 className="font-semibold text-2xl">Cart summary</h2>
					<small className="font-medium text-gray-400 text-xs">use 0FF10 to get 10% off</small>
					<div className="flex items-center gap-2 pb-2">
						<input
							className="h-10 w-48 bg-gray-100 px-4 outline-black duration-100"
							type="text"
							placeholder="Promo code"
							onInput={(e) => setPromoCode(e.currentTarget.value)}
							value={promoCode}
						/>
						<button
							className="h-10 rounded bg-black px-4 py-2 font-semibold text-sm text-white"
							onClick={() => {
								if (promoCode === "OFF10") {
									setDiscountPercent(10);
									toast.success("Discount applied");
									return;
								}
								setDiscountPercent(0);
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
					{isSignedIn ? (
						<button
							className="!mt-4 w-full bg-black px-6 py-4 font-bold text-white uppercase disabled:cursor-not-allowed disabled:bg-gray-500"
							disabled={cartItems.length === 0}
							onClick={() => {
								paddle.current?.Checkout.open({
									discountCode: promoCode,
									items: cartItems.map((item) => ({
										priceId: products.find((product) => product.id === item.id)?.prices[0].id!,
										quantity: cart[item.id],
									})),
								});
							}}
						>
							Checkout
						</button>
					) : (
						<div className="!mt-4 flex w-full justify-center bg-black px-6 py-4 font-bold *:text-white *:uppercase">
							<SignInButton mode="modal" fallbackRedirectUrl="/?isSignInRedirect=true">
								Sign in to checkout
							</SignInButton>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default Page;
