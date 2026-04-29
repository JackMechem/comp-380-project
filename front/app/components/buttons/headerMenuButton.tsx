"use client";

import { useSidebarStore } from "@/stores/sidebarStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { BsBookmark } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import CartButton from "./cartButton";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import styles from "./headerMenuButton.module.css";

const HeaderMenuButton = () => {
    const { toggleMenu } = useSidebarStore();
    const bookmarkCount = useBookmarkStore((s) => s.bookmarks.length);
    const { isAuthenticated, role } = useUserDashboardStore();

    return (
        <div className={styles.button} onClick={toggleMenu}>
            <span className={styles.menuText}>Menu</span>
            <CartButton />
            {isAuthenticated && (
                <div className={styles.iconWrapper}>
                    <BsBookmark />
                    {bookmarkCount > 0 && (
                        <div className={styles.badge}>{bookmarkCount}</div>
                    )}
                </div>
            )}
            {role === "ADMIN" ? (
                <div className={styles.roleAvatar} style={{ background: "var(--color-accent)" }}>
                    <BiUser style={{ fontSize: 16, color: "#fff" }} />
                </div>
            ) : role === "STAFF" ? (
                <div className={styles.roleAvatar} style={{ background: "var(--color-accent)" }}>
                    <BiUser style={{ fontSize: 16, color: "#fff" }} />
                </div>
            ) : (
                <DefaultProfilePhoto totalHeight={30} headSize={10} />
            )}
        </div>
    );
};

export default HeaderMenuButton;
