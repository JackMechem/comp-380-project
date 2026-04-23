"use client";

import { useState } from "react";
import Image from "next/image";
import { BiCar } from "react-icons/bi";
import styles from "./CarImageFill.module.css";

interface Props {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    loading?: "lazy" | "eager";
    /** Smaller icon for thumbnail slots */
    small?: boolean;
}

const CarImageFill = ({ src, alt, className, sizes, loading = "lazy", small }: Props) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && (
                <div className={styles.shimmer}>
                    <span className={`${styles.shimmerIcon} ${small ? styles.shimmerIconSm : ""}`}>
                        <BiCar />
                    </span>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`${className ?? ""} ${styles.img} ${loaded ? styles.imgVisible : styles.imgHidden}`}
                sizes={sizes}
                loading={loading}
                onLoad={() => setLoaded(true)}
            />
        </>
    );
};

export default CarImageFill;
