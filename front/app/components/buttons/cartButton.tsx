"use client";

import { useCartStore } from "@/stores/cartStore";
import { BsCart2 } from "react-icons/bs";
import { CartProps } from "@/app/types/CartTypes";

const CartButton = () => {
	const { carData }: { carData: CartProps[] } = useCartStore();
	const cartCount: number = carData.length;
	return (
		<>
			<div>
				<BsCart2 />
				<div
					className={`absolute text-[8pt] font-[600] px-[8px] py-[2px] right-[52px] top-[-3px] rounded-full ${cartCount < 1 && "hidden text-accent"}`}
				>
					{cartCount}
				</div>
			</div>
		</>
	);
};

export default CartButton;
