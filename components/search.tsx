import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LuSearch, LuX } from "react-icons/lu";

interface SearchProps {
	onSearch: (value: string) => void;
}

export const Search = (props: SearchProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const value = searchParams.get("search") ?? "";

	useEffect(() => {
		props.onSearch(value);
	}, [value, props]);

	return (
		<label className="flex w-fit items-center gap-2 rounded-md bg-white px-2 shadow-md outline-gray-600 focus-within:outline">
			<LuSearch />
			<input
				className="h-9 outline-none"
				type="text"
				placeholder="Search"
				onChange={(e) => {
					const url = new URL(location.href);
					url.searchParams.set("search", e.target.value);
					router.replace(url.toString());
				}}
				value={value}
			/>
			<button
				className={`text-gray-700 ${value.length === 0 && "invisible"}`}
				aria-label="Clear search"
				onClick={() => {
					const url = new URL(location.href);
					url.searchParams.delete("search");
					router.replace(url.toString());
				}}
				type="button"
			>
				<LuX className="size-4 stroke-[3]" />
			</button>
		</label>
	);
};
