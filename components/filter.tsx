import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Dialog, DialogTrigger, Label, Popover, Slider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";
import { LuSlidersHorizontal } from "react-icons/lu";
import { z } from "zod";

const MIN_PRICE = 0;
const MAX_PRICE = 5000;
const DEFAULT_FILTER = { price: { min: MIN_PRICE, max: MAX_PRICE } };

const filterSchema = z
	.object({
		price: z.object({
			min: z.number().min(MIN_PRICE).max(MAX_PRICE),
			max: z.number().min(MIN_PRICE).max(MAX_PRICE),
		}),
	})
	.default(DEFAULT_FILTER)
	.catch(DEFAULT_FILTER);

interface FilterProps {
	onFilter: (value: z.infer<typeof filterSchema>) => void;
}

export const Filter = (props: FilterProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [filter, setFilter] = useState(filterSchema.parse(JSON.parse(decodeURIComponent(searchParams.get("filter") ?? "") || "{}")));

	useEffect(() => {
		props.onFilter(filter);
	}, [filter, props]);

	useLayoutEffect(() => {
		const url = new URL(location.href);
		url.searchParams.set("filter", encodeURIComponent(JSON.stringify(filter)));
		router.replace(url.toString());
	}, [filter, router]);

	return (
		<DialogTrigger>
			<Button className="p-2 outline-none">
				<LuSlidersHorizontal className="size-5 stroke-[3]" />
			</Button>
			<Popover>
				<Dialog className="flex w-64 flex-col gap-4 rounded-md bg-white p-6 font-semibold shadow-lg outline outline-gray-500">
					{({ close }) => (
						<>
							<Slider
								defaultValue={[filter.price.min, filter.price.max]}
								minValue={MIN_PRICE}
								maxValue={MAX_PRICE}
								onChange={(value) => setFilter({ ...filter, price: { min: value[0], max: value[1] } })}
							>
								<div className="flex items-center justify-between gap-2">
									<Label>Price</Label>
									<SliderOutput>
										{({ state }) => (
											<>
												${state.values[0]} - ${state.values[1]}
											</>
										)}
									</SliderOutput>
								</div>
								<SliderTrack className="h-7">
									{({ state }) => (
										<>
											<div className="absolute top-[50%] h-2 w-full translate-y-[-50%] rounded-full bg-gray-300" />
											<div
												className="absolute top-[50%] h-2 translate-y-[-50%] rounded-full bg-gray-500"
												style={{
													width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
													left: `${state.getThumbPercent(0) * 100}%`,
												}}
											/>
											{state.values.map((_item, i) => (
												<SliderThumb
													className="top-[50%] size-5 rounded-full border border-gray-500 bg-white outline-none"
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													key={i}
													index={i}
												/>
											))}
										</>
									)}
								</SliderTrack>
							</Slider>
							<button
								className="rounded border border-black p-2 duration-100 hover:bg-black hover:text-white"
								onClick={() => {
									setFilter(DEFAULT_FILTER);
									close();
								}}
							>
								Reset Filter
							</button>
						</>
					)}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
};
