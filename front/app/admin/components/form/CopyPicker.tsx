"use client";

import { useState } from "react";
import Image from "next/image";
import { BiCar, BiCheck, BiSearch, BiX } from "react-icons/bi";
import styles from "./adminForm.module.css";

export interface CopyOption {
	vin: string;
	make: string;
	model: string;
	modelYear: number;
	images: string[];
	vehicleClass: string;
	pricePerDay: number;
}

interface CopyPickerProps {
	options: CopyOption[];
	selectedVin: string | null;
	onSelect: (vin: string | null) => void;
	mode: "add" | "edit";
}

const CopyPicker = ({
	options,
	selectedVin,
	onSelect,
	mode,
}: CopyPickerProps) => {
	const [query, setQuery] = useState("");

	const filtered = options
		.filter((o) =>
			`${o.make} ${o.model} ${o.vin}`
				.toLowerCase()
				.includes(query.toLowerCase()),
		)
		.slice(0, 10);

	return (
		<div className={styles.copyPickerCard}>
			<div className={styles.copyPickerHeader}>
				<p className={styles.copyPickerTitle}>
					{mode === "edit"
						? "Select a vehicle to edit"
						: "Copy from existing vehicle"}
				</p>
				{selectedVin && (
					<button
						type="button"
						onClick={() => onSelect(null)}
						className={styles.copyPickerClearBtn}
					>
						<BiX /> Clear
					</button>
				)}
			</div>

			<div className={styles.copyPickerSearch}>
				<BiSearch className={styles.copyPickerSearchIcon} />
				<input
					className={`${styles.input} ${styles.copyPickerSearch}`}
					style={{ paddingLeft: "36px" }}
					placeholder={
						mode === "edit"
							? "Search for a vehicle to edit…"
							: "Search by make, model or VIN…"
					}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>

			<div className={`${styles.copyPickerStrip} scrollbar-hide`}>
				{filtered.length === 0 && (
					<p className={styles.copyPickerEmpty}>No vehicles found.</p>
				)}
				{filtered.map((car) => {
					const isSelected = selectedVin === car.vin;
					return (
						<button
							key={car.vin}
							type="button"
							onClick={() => onSelect(isSelected ? null : car.vin)}
							className={`${styles.copyPickerCarBtn} ${isSelected ? styles.copyPickerCarBtnSelected : ""}`}
						>
							<div className={styles.copyPickerThumb}>
								{car.images?.[0] ? (
									<Image
										src={car.images[0]}
										alt={`${car.make} ${car.model}`}
										fill
                                        className={styles.copyPickerCarImage}
										sizes="160px"
									/>
								) : (
									<div className={styles.copyPickerNoImage}>
										<BiCar />
									</div>
								)}
								{isSelected && (
									<div className={styles.copyPickerCheckBadge}>
										<BiCheck className={styles.copyPickerCheckIcon} />
									</div>
								)}
							</div>
							<div className={styles.copyPickerInfo}>
								<p className={styles.copyPickerCarName}>
									{car.make} {car.model}
								</p>
								<p className={styles.copyPickerCarYear}>{car.modelYear}</p>
								<p className={styles.copyPickerCarPrice}>
									${car.pricePerDay}/day
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default CopyPicker;
