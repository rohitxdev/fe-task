import { useEffect, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
interface SearchProps {
	onSearch: (value: string) => void;
}

export const Search = (props: SearchProps) => {
	const [value, setValue] = useState("");

	useEffect(() => {
		props.onSearch(value);
	}, [value, props]);

	return (
		<label className="flex w-fit items-center gap-2 rounded-md bg-white px-2 shadow-md outline-gray-600 focus-within:outline">
			<LuSearch />
			<input className="h-9 outline-none" type="text" placeholder="Search" onChange={(e) => setValue(e.target.value)} value={value} />
			<button
				className={`text-gray-700 ${value.length === 0 && "invisible"}`}
				aria-label="Clear search"
				onClick={() => setValue("")}
				type="button"
			>
				<LuX className="size-4 stroke-[3]" />
			</button>
		</label>
	);
};
