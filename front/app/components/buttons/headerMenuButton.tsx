"use client";

import { useSidebarStore } from "@/stores/sidebarStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { BsBookmark } from "react-icons/bs";
import CartButton from "./cartButton";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import styles from "./headerMenuButton.module.css";

const HeaderMenuButton = () => {
    const { toggleMenu } = useSidebarStore();
    const bookmarkCount = useBookmarkStore((s) => s.bookmarks.length);
    const isAuthenticated = useUserDashboardStore((s) => s.isAuthenticated);

    return (
        <div className={styles.button} onClick={toggleMenu}>
            <CartButton />
            {isAuthenticated && (
                <div className={styles.iconWrapper}>
                    <BsBookmark />
                    {bookmarkCount > 0 && (
                        <div className={styles.badge}>{bookmarkCount}</div>
                    )}
                </div>
            )}
            <DefaultProfilePhoto totalHeight={30} headSize={10} />
        </div>
    );
};

export default HeaderMenuButton;
