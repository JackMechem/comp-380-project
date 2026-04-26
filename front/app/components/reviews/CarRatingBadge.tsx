import StarRating from "./StarRating";
import styles from "./reviews.module.css";

const CarRatingBadge = ({ averageRating }: { averageRating?: number }) => {
    if (averageRating === undefined) return null;

    return averageRating < 0
        ? <span className={styles.noRatings}>No ratings yet</span>
        : <StarRating average={averageRating} size="sm" />;
};

export default CarRatingBadge;
