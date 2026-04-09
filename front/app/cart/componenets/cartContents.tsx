"use client";

import { CartProps } from "@/app/types/CartTypes";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import Link from "next/link";

const CartContents = () => {
	const { carData, addCar, removeCar, inCart, clearCart } = useCartStore();

	return (
		<div className="h-full w-fit flex flex-col gap-[30px]">
			{carData.map((cart: CartProps) => {
				return (
					<div
						className="rounded-xl overflow-clip bg-primary-dark max-w-[900px] mx-[10px] flex flex-col relative"
						key={cart.vin}
					>
						<Image
							src={cart.image!}
							alt="car image"
							width={800}
							height={500}
							className="w-full h-[400px] object-cover"
							loading="lazy"
						/>
						<div className="font-titillium text-[16pt] text-accent font-[500] opacity-[0.8] absolute top-0 left-0 bg-primary px-[10px] py-[8px] rounded-br-lg">
							September 10, 2026 - September 12, 2026
						</div>
						<div className="px-[25px] py-[20px] flex justify-between">
							<h2 className="font-titillium text-[20pt] text-accent font-[500]">
								{cart.make}{" "}
								<span className="text-[15pt] ml-[10px] opacity-[0.8]">
									{cart.model}
								</span>
							</h2>
						</div>
					</div>
				);
			})}
			<Link href={"/checkout"} className="bg-accent opacity-[0.9] hover:opacity-[1] w-full py-[8px] rounded-md text-primary text-primary/90 tracking-wide cursor-pointer text-[14pt] border-2 border-primary/60 flex justify-center">Checkout</Link>
		</div>
	);
};

export default CartContents;
