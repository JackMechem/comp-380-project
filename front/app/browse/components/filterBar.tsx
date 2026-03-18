"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FilterBarDropdown from "./filterBarDropdown";
import FilterBarYearRange from "./filterBarYearSelect";
import { BiRefresh } from "react-icons/bi";
import FilterBarInput from "./filterBarInput";
import FilterBarNumberRange from "./filterBarNumberRange";

interface FilterAndSelectFields {
	page?: string;
	pageSize?: string;
	select?: string;
	sortBy?: string;
	sortDir?: string;
	make?: string;
	model?: string;
	modelYear?: string;
	minModelYear?: string;
	maxModelYear?: string;
	transmission?: string;
	drivetrain?: string;
	engineLayout?: string;
	fuel?: string;
	bodyType?: string;
	roofType?: string;
	vehicleClass?: string;
    minHorsepower?: number;
    maxHorsepower?: number;
}

const FilterBar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const get = (key: keyof FilterAndSelectFields) =>
		searchParams.get(key) ?? undefined;

	const applyParam = (
		param: keyof FilterAndSelectFields,
		value: string | null,
	) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(param, value);
		else params.delete(param);
		router.push(`${pathname}?${params.toString()}`);
	};

	const applyMultiple = (updates: Partial<FilterAndSelectFields>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(updates)) {
			if (value) params.set(key, value.toString());
			else params.delete(key);
		}
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="w-full bg-primary border-y border-y-third shadow-sm shadow-third/30 p-[10px] text-foreground flex gap-[15px] items-center justify-start">
			<FilterBarInput
				label="Make"
				paramId="make"
				defaultValue={get("make")}
				onChange={(v) => applyParam("make", v)}
			/>
			<FilterBarInput
				label="Model"
				paramId="model"
				defaultValue={get("model")}
				onChange={(v) => applyParam("model", v)}
			/>
			<FilterBarYearRange
				defaultMin={get("minModelYear")}
				defaultMax={get("maxModelYear")}
				onApply={(min, max) =>
					applyMultiple({
						minModelYear: min || undefined,
						maxModelYear: max || undefined,
					})
				}
			/>
			<FilterBarDropdown
				label="Transmission"
				options={[
					{ paramId: "MANUAL", displayText: "Manual" },
					{ paramId: "AUTOMATIC", displayText: "Automatic" },
				]}
				defaultValue={get("transmission")}
				onChange={(v) => applyParam("transmission", v)}
			/>
			<FilterBarDropdown
				label="Engine Layout"
				options={[
					{ paramId: "V", displayText: "V" },
					{ paramId: "INLINE", displayText: "Inline" },
					{ paramId: "FLAT", displayText: "Flat" },
					{ paramId: "SINGLE_MOTOR", displayText: "Single Motor" },
					{ paramId: "DUAL_MOTOR", displayText: "Dual Motor" },
				]}
				defaultValue={get("engineLayout")}
				onChange={(v) => applyParam("engineLayout", v)}
			/>
			<FilterBarDropdown
				label="Drivetrain"
				options={[
					{ paramId: "FWD", displayText: "Front Wheel Drive" },
					{ paramId: "RWD", displayText: "Rear Wheel Drive" },
					{ paramId: "AWD", displayText: "All Wheel Drive" },
				]}
				defaultValue={get("drivetrain")}
				onChange={(v) => applyParam("drivetrain", v)}
			/>
			<FilterBarNumberRange
				label="Horsepower"
				paramId="horsepower"
				defaultMin={get("minHorsepower")}
				defaultMax={get("maxHorsepower")}
				min={0}
				max={1000}
				onApply={(min, max) =>
					applyMultiple({ minHorsepower: Number.parseInt(min), maxHorsepower: Number.parseInt(max) })
				}
			/>
			<div className="flex gap-[10px] ml-auto h-full items-center">
				<FilterBarDropdown
					label="Sort Direction"
					showAll={false}
					options={[
						{ paramId: "ASC", displayText: "Ascending" },
						{ paramId: "DESC", displayText: "Descending" },
					]}
					defaultValue={get("sortDir") ?? "ASC"}
					onChange={(v) => applyParam("sortDir", v)}
				/>
				<FilterBarDropdown
					label="Sort By"
					showAll={false}
					options={[
						{ paramId: "make", displayText: "Make" },
						{ paramId: "model", displayText: "Model" },
						{ paramId: "modelYear", displayText: "Model Year" },
						{ paramId: "pricePerDay", displayText: "Price/Day" },
						{ paramId: "cylinders", displayText: "Cylinders" },
						{ paramId: "gears", displayText: "Gears" },
						{ paramId: "horsepower", displayText: "Horsepower" },
						{ paramId: "seats", displayText: "Seats" },
						{ paramId: "torque", displayText: "Torque" },
						{ paramId: "mpg", displayText: "MPG" },
					]}
					defaultValue={get("sortBy") ?? "make"}
					onChange={(v) => applyParam("sortBy", v)}
				/>
				<button
					onClick={() => router.push(pathname)}
					className="bg-accent/80 rounded-full px-[10px] py-[5px] text-primary-dark ml-[20px]"
				>
					<BiRefresh />
				</button>
			</div>
		</div>
	);
};

export default FilterBar;
