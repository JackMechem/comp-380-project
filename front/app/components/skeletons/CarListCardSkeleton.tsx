import styles from "./skeletons.module.css";

/** Skeleton for a single list-view car card on the browse page. */
const CarListCardSkeleton = () => (
	<div className={styles.listCard}>
		<div className={styles.listCardImage} />
		<div className={styles.listCardBody}>
			<div className={styles.listCardTitleGroup}>
				<div className={styles.listCardTitleRow}>
					<div className={`${styles.pulse} ${styles.h24w40}`} />
					<div className={`${styles.pulse} ${styles.h20w25}`} />
				</div>
				<div className={`${styles.pulse} ${styles.h16w20}`} />
			</div>
			<div className={styles.listCardBottom}>
				<div className={styles.listCardStatGroup}>
					<div className={`${styles.pulse} ${styles.h14w80}`} />
					<div className={`${styles.pulse} ${styles.h14w50}`} />
					<div className={`${styles.pulse} ${styles.h14w70}`} />
				</div>
				<div className={styles.listCardPriceGroup}>
					<div className={`${styles.pulse} ${styles.h32w110}`} />
					<div className={`${styles.pulse} ${styles.h12w70}`} />
				</div>
			</div>
		</div>
	</div>
);

export default CarListCardSkeleton;
