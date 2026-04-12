"use client";

import DatePicker from "@/app/components/DatePicker";
import { useHydrated } from "@/app/hooks/useHydrated";
import { CartProps } from "@/app/types/CartTypes";
import { Car } from "@/app/types/CarTypes";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import styles from "./carDetail.module.css";

const carToCartProps = (car: Car, startDate?: Date, endDate?: Date): CartProps => ({
	vin: car.vin,
	make: car.make,
	model: car.model,
	pricePerDay: car.pricePerDay,
	image: car.images[0] ?? undefined,
	startDate: startDate?.toISOString(),
	endDate: endDate?.toISOString(),
});

const RightColumn = ({ carData }: { carData: Car }) => {
	const { addCar, removeCar, inCart } = useCartStore();
	const isInCart = inCart(carData.vin);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const hydrated = useHydrated();

	const canAdd = isInCart || (!!startDate && !!endDate);

	if (!hydrated) return null;

	return (
		<div className={`card ${styles.rightCol}`}>

			{/* Price */}
			<div className={styles.priceBlock}>
				<p className={styles.priceMain}>
					${carData.pricePerDay}
					<span className={styles.priceSuffix}>/day</span>
				</p>
				<p className={styles.priceSub}>Before taxes</p>
			</div>

			<div className={styles.divider} />

			{/* Date pickers */}
			<div className={styles.tripSection}>
				<p className={styles.tripTitle}>Your Trip</p>
				<div className={styles.datepickerGrid}>
					<div>
						<label className={styles.datepickerLabel}>Trip Start</label>
						<div className={styles.datepickerBox}>
							<DatePicker
								label="Trip Start"
								showLabel={false}
								placeholder="Add date"
								selected={startDate}
								fromDate={new Date()}
								onSelect={(d) => {
									setStartDate(d);
									if (endDate && d && d > endDate) setEndDate(undefined);
								}}
							/>
						</div>
					</div>
					<div>
						<label className={styles.datepickerLabel}>Trip End</label>
						<div className={styles.datepickerBox}>
							<DatePicker
								label="Trip End"
								showLabel={false}
								placeholder="Add date"
								selected={endDate}
								onSelect={setEndDate}
								fromDate={startDate}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.divider} />

			{/* Hint */}
			{!isInCart && (!startDate || !endDate) && (
				<p className={styles.hint}>Select trip dates to add to cart</p>
			)}

			{/* CTA */}
			<button
				disabled={!canAdd}
				onClick={() =>
					isInCart
						? removeCar(carData.vin)
						: addCar(carToCartProps(carData, startDate, endDate))
				}
				className={`${styles.ctaBtn} ${isInCart ? styles.ctaBtnRemove : styles.ctaBtnAdd}`}
			>
				{isInCart ? "Remove from cart" : "Add to cart"}
			</button>
		</div>
	);
};

export default RightColumn;
