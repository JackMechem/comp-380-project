"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import styles from "./CartNotification.module.css";

const CartNotification = () => {
    const { notification, clearNotification } = useCartStore();

    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(clearNotification, 5000);
        return () => clearTimeout(timer);
    }, [notification]);

    if (!notification) return null;

    return (
        <div className={styles.wrapper} onClick={clearNotification}>
            <div className={styles.card}>
                {notification.image && (
                    <Image
                        src={notification.image}
                        alt="Car Photo"
                        width={100}
                        height={100}
                        className={styles.image}
                    />
                )}
                <div className={styles.body}>
                    <p className={styles.carName}>
                        {notification.make} {notification.model}
                    </p>
                    <h3 className={styles.price}>
                        ${notification.pricePerDay}
                        <span className={styles.priceUnit}>/day</span>
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default CartNotification;
