"use client";
import { Car } from "@/app/types/CarTypes";
import CarCard from "../cards/carCard";
import { useRef } from "react";
import styles from "./carScroll.module.css";

interface CarScrollProps {
	cars: Car[];
}

const CarScroll = ({ cars }: CarScrollProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<div ref={scrollRef} className={styles.grid}>
			{cars.map((car: Car) => (
				<CarCard key={car.vin} car={car} />
			))}
		</div>
	);
};

export default CarScroll;
