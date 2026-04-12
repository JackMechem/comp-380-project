import styles from "./skeletons.module.css";
import CarBrandCardSkeleton from "./CarBrandCardSkeleton";

/** Skeleton for the entire brand scroll section on the home page. */
const BrandScrollSkeleton = () => (
	<div className={styles.brandScrollWrapper}>
		{Array.from({ length: 3 }).map((_, i) => (
			<CarBrandCardSkeleton key={i} />
		))}
	</div>
);

export default BrandScrollSkeleton;
