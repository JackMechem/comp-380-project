"use client";
import { useEffect, useRef, useState } from "react";
import { Car, CarApiParams } from "@/app/types/CarTypes";
import { fetchCarsPage } from "../actions";
import CarCard from "@/app/components/cars/CarListCard";
import CarGridCard from "@/app/components/cars/carGridCard";
import CarListCardSkeleton from "@/app/components/skeletons/CarListCardSkeleton";
import CarGridCardSkeleton from "@/app/components/skeletons/CarGridCardSkeleton";
import styles from "./browseContent.module.css";

interface InfiniteCarListProps {
	initialCars: Car[];
	totalPages: number;
	filterParams: CarApiParams;
	layout?: "list" | "grid";
}

const InfiniteCarList = ({ initialCars, totalPages, filterParams, layout = "list" }: InfiniteCarListProps) => {
	const [cars, setCars] = useState<Car[]>(initialCars);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(totalPages > 1);
	const [isSmall, setIsSmall] = useState(() =>
		typeof window !== "undefined" ? !window.matchMedia("(min-width: 640px)").matches : false
	);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);
	const pageRef = useRef(1);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 640px)");
		const handler = (e: MediaQueryListEvent) => setIsSmall(!e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			async (entries) => {
				if (!entries[0].isIntersecting || loadingRef.current) return;

				loadingRef.current = true;
				setLoading(true);

				const nextPage = pageRef.current + 1;
				const result = await fetchCarsPage({ ...filterParams, page: nextPage });

				setCars((prev) => {
					const seen = new Set(prev.map((c) => c.vin));
					return [...prev, ...result.data.filter((c) => !seen.has(c.vin))];
				});
				pageRef.current = nextPage;
				const more = nextPage < totalPages;
				setHasMore(more);
				if (!more) observer.disconnect();

				loadingRef.current = false;
				setLoading(false);
			},
			{ rootMargin: "200px" }
		);

		if (sentinelRef.current) observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, []);

	const isList = layout === "list" && !isSmall;

	return (
		<>
			<div className={isList ? styles.listGrid : styles.carGrid}>
				{cars.map((car) =>
					isList ? (
						<CarCard key={car.vin} car={car} />
					) : (
						<CarGridCard key={car.vin} car={car} />
					)
				)}
				{loading && (
					isList ? (
						<>
							<CarListCardSkeleton />
							<CarListCardSkeleton />
						</>
					) : (
						<>
							<CarGridCardSkeleton />
							<CarGridCardSkeleton />
							<CarGridCardSkeleton />
							<CarGridCardSkeleton />
						</>
					)
				)}
			</div>
			{hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
		</>
	);
};

export default InfiniteCarList;
