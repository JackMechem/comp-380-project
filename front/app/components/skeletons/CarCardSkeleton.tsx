import styles from "./skeletons.module.css";

/** Skeleton for the simple carousel CarCard used on the home page. */
const CarCardSkeleton = () => (
	<div className={styles.carCard}>
		<div className={styles.carCardImageArea} />
		<div className={styles.carCardBody}>
			<div className={styles.carCardTitleRow}>
				<div className={styles.carCardTitleGroup}>
					<div className={`${styles.pulse} ${styles.h20w70}`} />
					<div className={`${styles.pulse} ${styles.h14w30}`} />
				</div>
				<div className={`${styles.pulse} ${styles.w25h25}`} />
			</div>
			<div className={styles.carCardPriceRow}>
				<div className={`${styles.pulse} ${styles.h20w60}`} />
				<div className={`${styles.pulse} ${styles.h30wFull}`} />
			</div>
		</div>
	</div>
);

export default CarCardSkeleton;
