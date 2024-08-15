import { ReactComponent as Spinner } from "@/assets/spinner.svg";

export const Fallback = () => {
	return (
		<div className="flex size-full items-center justify-center font-semibold text-gray-500 text-lg">
			<p>Loading...</p>
			<Spinner className="ml-2 size-6" />
		</div>
	);
};
