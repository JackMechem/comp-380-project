import styles from "./skeletons.module.css";
import CarCardSkeleton from "./CarCardSkeleton";

/** Skeleton for the full horizontal car carousel on the home page. */
const CarScrollSkeleton = () => (
	<div className={styles.carScrollGrid}>
		{Array.from({ length: 5 }).map((_, i) => (
			<CarCardSkeleton key={i} />
		))}
	</div>
);

export default CarScrollSkeleton;
