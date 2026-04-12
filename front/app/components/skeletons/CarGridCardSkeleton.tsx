import styles from "./skeletons.module.css";

/** Skeleton for a single grid-view car card on the browse page. */
const CarGridCardSkeleton = () => (
	<div className={styles.gridCard}>
		<div className={styles.gridCardImageArea} />
		<div className={styles.gridCardBody}>
			<div className={styles.gridCardTitleGroup}>
				<div className={`${styles.pulse} ${styles.h18w70}`} />
				<div className={`${styles.pulse} ${styles.h14w30}`} />
			</div>
			<div className={styles.gridCardStats}>
				<div className={`${styles.pulse} ${styles.h14w50}`} />
				<div className={`${styles.pulse} ${styles.h14w40}`} />
				<div className={`${styles.pulse} ${styles.h14w55}`} />
			</div>
			<div className={styles.gridCardPriceRow}>
				<div className={`${styles.pulse} ${styles.h22w70}`} />
				<div className={`${styles.pulse} ${styles.h28w80}`} />
			</div>
		</div>
	</div>
);

export default CarGridCardSkeleton;
