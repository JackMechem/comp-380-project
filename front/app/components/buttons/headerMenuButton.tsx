"use client";

import { useSidebarStore } from "@/stores/sidebarStore";
import CartButton from "./cartButton";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import styles from "./headerMenuButton.module.css";

const HeaderMenuButton = () => {
    const { toggleMenu } = useSidebarStore();

    return (
        <div className={styles.button} onClick={toggleMenu}>
            <CartButton />
            <DefaultProfilePhoto totalHeight={30} headSize={10} />
        </div>
    );
};

export default HeaderMenuButton;
