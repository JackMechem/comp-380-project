"use client";

import { useBookmarkStore, BookmarkCar, toggleBookmark } from "@/stores/bookmarkStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import styles from "./bookmarkButton.module.css";

const BookmarkButton = ({ car, variant = "overlay" }: { car: BookmarkCar; variant?: "overlay" | "inline" }) => {
    const bookmarked = useBookmarkStore((s) => s.isBookmarked(car.vin));
    const { accountId, isAuthenticated } = useUserDashboardStore();

    if (!isAuthenticated || !accountId) return null;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(accountId, car);
    };

    return (
        <button onClick={handleClick} className={variant === "inline" ? styles.btnInline : styles.btn} title={bookmarked ? "Remove bookmark" : "Bookmark"}>
            {bookmarked ? <BsBookmarkFill className={styles.filled} /> : <BsBookmark className={styles.outline} />}
        </button>
    );
};

export default BookmarkButton;
