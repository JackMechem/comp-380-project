"use client";

import { useCartStore } from "@/stores/cartStore";
import { BsCart2, BsCartX } from "react-icons/bs";
import { CartProps } from "@/app/types/CartTypes";
import styles from "./cartButton.module.css";

const CartButton = () => {
	const { carData }: { carData: CartProps[] } = useCartStore();
	const cartCount: number = carData.length;
	return (
		<>
            {cartCount > 0 ?
			<div className={styles.wrapper}>
				<BsCart2 />
				<div className={styles.badge}>
					{cartCount}
				</div>
			</div>
            :
                <div>
                    <BsCartX />
                </div>
            }
		</>
	);
};

export default CartButton;
