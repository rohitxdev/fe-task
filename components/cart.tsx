import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";

export const Cart = () => {
	const { cart } = useCart();

	return (
		<Link className="relative" href="/cart">
			{Object.keys(cart).length > 0 && (
				<span className="-translate-y-1/2 absolute top-0 right-0 size-2 translate-x-1/2 rounded-full bg-blue-500 text-white" />
			)}
			<LuShoppingCart className="size-6 stroke-[3]" />
		</Link>
	);
};
