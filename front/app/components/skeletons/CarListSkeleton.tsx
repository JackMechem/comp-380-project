import styles from "./skeletons.module.css";
import CarListCardSkeleton from "./CarListCardSkeleton";

/** Skeleton for the full list-view grid on the browse page. */
const CarListSkeleton = () => (
	<div className={styles.carListGrid}>
		{Array.from({ length: 8 }).map((_, i) => (
			<CarListCardSkeleton key={i} />
		))}
	</div>
);

export default CarListSkeleton;
