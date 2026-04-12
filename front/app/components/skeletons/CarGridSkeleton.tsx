import styles from "./skeletons.module.css";
import CarGridCardSkeleton from "./CarGridCardSkeleton";

/** Skeleton for the full grid layout on the browse page. */
const CarGridSkeleton = () => (
	<div className={styles.carGridGrid}>
		{Array.from({ length: 8 }).map((_, i) => (
			<CarGridCardSkeleton key={i} />
		))}
	</div>
);

export default CarGridSkeleton;
