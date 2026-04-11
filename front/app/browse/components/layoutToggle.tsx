"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BsGrid, BsList } from "react-icons/bs";

const LayoutToggle = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const isGrid = searchParams.get("layout") === "grid";

	const toggle = () => {
		const params = new URLSearchParams(searchParams.toString());
		if (isGrid) {
			params.delete("layout");
		} else {
			params.set("layout", "grid");
		}
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<button
			onClick={toggle}
			className="text-foreground flex items-center justify-center px-[6px] py-[5px] rounded-xl hover:bg-primary-dark text-[18pt] border border-transparent cursor-pointer hover:border-third/80"
			title={isGrid ? "Switch to list view" : "Switch to grid view"}
		>
			{isGrid ? <BsList /> : <BsGrid />}
		</button>
	);
};

export default LayoutToggle;
