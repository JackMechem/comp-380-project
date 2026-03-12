"use client";

import Link from "next/link";

import { useCartStore } from "@/stores/cartStore";
import TitleText from "../text/titleText";
import { BiTrash } from "react-icons/bi";
import { CartProps } from "@/app/types/CartTypes";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import Image from "next/image";

const HeaderMenu = () => {
	const {
		carData,
		removeCar,
	}: { carData: CartProps[]; removeCar: (vin: string) => void } =
		useCartStore();
	const cartCount: number = carData.length;
	return (
		<div className="absolute z-100 right-[10px] top-[100%] mt-[10px] border border-third/80 bg-primary shadow-md text-foreground min-w-[360px] rounded-lg">
			<div className="flex w-full flex-col justify-center items-center bg-primary-dark py-[10px] px-[15px]">
				<div className="flex flex-col gap-[10px] items-center justify-center py-[15px] w-full">
					<div className="w-fit h-fit border-4 border-accent p-[2px] rounded-full">
						<DefaultProfilePhoto totalHeight={60} headSize={18} />
					</div>
					<h2 className="font-titillium text-accent text-[18pt] text-center font-[600]">
						Guest
					</h2>
					<div className="flex w-full items-center gap-[10px]">
						<Link
							href={"/signup"}
							className="font-[500] text-[11pt] w-full text-center text-accent px-[12px] py-[6px] bg-primary border border-third/50 rounded-lg hover:shadow hover:bg-accent/90 hover:text-primary duration-[200ms]"
						>
							Signup
						</Link>
						<Link
							href={"/login"}
							className="font-[500] text-[11pt] w-full text-center text-accent px-[12px] py-[6px] bg-primary border border-third/50 rounded-lg hover:shadow hover:bg-accent/90 hover:text-primary duration-[200ms]"
						>
							Login
						</Link>
					</div>
				</div>
			</div>
			<div className="py-[10px] px-[15px] flex flex-col w-full">
				<TitleText className="mb-[10px]">Shopping Cart</TitleText>
				<p className="text-[12pt] font-[500]">
					{cartCount} {cartCount == 1 ? "car" : "cars"} in your cart
				</p>
				{cartCount > 0 && (
					<div className="w-full rounded-md px-[0px] py-[5px] flex flex-col gap-[5px]">
						{carData.map((car: CartProps) => (
							<div
								key={car.vin}
								className="w-full flex gap-[10px] text-[12pt] border border-third rounded-xl py-[0px] pr-[0px]"
							>
								{car.image && (
									<Image
										src={car.image}
										alt="Car Photo"
										width={100}
										height={100}
										className="h-[80px] w-[80px] object-cover rounded-l-lg"
									/>
								)}
								<div className="flex flex-col h-fill w-full justify-center">
									<p className="">
										{car.make} {car.model}
									</p>
								</div>
								<button
									onClick={() => {
										removeCar(car.vin);
									}}
									className="text-primary text-[14pt] px-[10px] h-fill bg-accent/70 rounded-r-xl cursor-pointer ml-auto"
								>
									<BiTrash />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<Link
				href={"/admin"}
				className="font-[500] text-[10pt] w-fit mt-[20px] ml-[10px] text-center text-accent"
			>
				Admin Dashboard
			</Link>
		</div>
	);
};

export default HeaderMenu;
