import { useAppContext } from "@/contexts/app-context";
import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowLeft, LuShoppingCart } from "react-icons/lu";

export const Nav = () => {
	const { cart } = useAppContext();
	const pathname = usePathname();

	return (
		<nav className="mb-2 flex items-center justify-end gap-4">
			{pathname === "/cart" ? (
				<Link className="mr-auto" aria-label="Back to products" href="/">
					<LuArrowLeft className="size-6 stroke-[3]" />
				</Link>
			) : (
				<Link className="relative rounded-md bg-white p-3 shadow-md" href="/cart">
					{Object.keys(cart).length > 0 && (
						<span className="-translate-y-1/2 absolute top-0 right-0 size-3 translate-x-1/2 rounded-full bg-blue-500 text-white" />
					)}
					<LuShoppingCart className="size-6 stroke-[3] max-md:size-4" />
				</Link>
			)}
			<SignedIn>
				<UserButton appearance={{ elements: { userButtonAvatarBox: { height: "2.5rem", width: "2.5rem" } } }} />
			</SignedIn>
		</nav>
	);
};
