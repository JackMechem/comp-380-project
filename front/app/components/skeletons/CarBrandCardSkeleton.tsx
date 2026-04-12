import styles from "./skeletons.module.css";

/** Skeleton for a single brand card (Porsche, BMW, etc.) on the home page. */
const CarBrandCardSkeleton = () => (
	<div className={styles.brandCard}>
		<div className={styles.brandCardHeader}>
			<div className={`${styles.pulse} ${styles.h40w40}`} />
			<div className={`${styles.pulse} ${styles.h20w80}`} />
		</div>
		<div className={`${styles.pulse} ${styles.h200wFull}`} />
		<div className={styles.brandCardFooter}>
			<div className={styles.brandCardPriceGroup}>
				<div className={`${styles.pulse} ${styles.h14w60}`} />
				<div className={`${styles.pulse} ${styles.h28w100}`} />
			</div>
			<div className={`${styles.pulse} ${styles.h36w120}`} />
		</div>
	</div>
);

export default CarBrandCardSkeleton;
