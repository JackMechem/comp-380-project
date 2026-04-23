"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CarApiParams } from "@/app/types/CarTypes";
import { useEffect, useState, useRef } from "react";

// Fields that support comma-separated multi-value filtering
const MULTI_ENUM_KEYS = new Set<keyof CarApiParams>([
	"bodyType", "vehicleClass", "roofType",
	"transmission", "drivetrain", "engineLayout", "fuel",
]);

const parseParams = (searchParams: URLSearchParams): Partial<CarApiParams> => {
	const result: Partial<CarApiParams> = {};
	for (const [key, value] of searchParams.entries()) {
		const k = key as keyof CarApiParams;
		if (MULTI_ENUM_KEYS.has(k) && value.includes(",")) {
			(result as Record<string, unknown>)[key] = value.split(",");
		} else {
			(result as Record<string, unknown>)[key] = value;
		}
	}
	return result;
};

export const useFilterParams = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isExternalChange = useRef(false);

	const [params, setParams] = useState<Partial<CarApiParams>>(
		() => parseParams(searchParams),
	);

	// Sync state when URL changes externally (e.g. browser back/forward)
	useEffect(() => {
		if (isExternalChange.current) {
			isExternalChange.current = false;
			return;
		}
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setParams(parseParams(searchParams));
	}, [searchParams.toString()]);

	// Push to URL whenever state changes
	useEffect(() => {
		const urlParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value == null || value === "") continue;
			if (Array.isArray(value)) {
				if (value.length > 0) urlParams.set(key, value.join(","));
			} else {
				urlParams.set(key, value.toString());
			}
		}
		if (urlParams.toString() === searchParams.toString()) return;
		isExternalChange.current = true;
		router.push(`${pathname}?${urlParams.toString()}`);
	}, [params]);

	const get = (key: keyof CarApiParams) => {
		const val = params[key];
		return val != null ? (Array.isArray(val) ? val.join(",") : val.toString()) : undefined;
	};

	const getArray = (key: keyof CarApiParams): string[] => {
		const val = params[key];
		if (!val) return [];
		if (Array.isArray(val)) return val as string[];
		return (val as string).split(",").filter(Boolean);
	};

	const set = (updates: Partial<CarApiParams>) => {
		setParams((prev) => {
			const next = { ...prev };
			for (const [key, value] of Object.entries(updates)) {
				if (value == null || value === "" || (Array.isArray(value) && value.length === 0))
					delete next[key as keyof CarApiParams];
				else (next as Record<string, unknown>)[key] = value;
			}
			return next;
		});
	};

	const remove = (key: keyof CarApiParams) => {
		setParams((prev) => {
			const next = { ...prev };
			delete next[key];
			return next;
		});
	};

	const clear = () => setParams({});
	const getAll = () => params;

	return { get, getArray, set, remove, clear, getAll, params, pathname };
};
