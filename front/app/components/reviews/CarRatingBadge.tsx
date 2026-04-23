"use client";

import { useEffect, useState } from "react";
import { Review } from "@/app/types/ReviewTypes";
import StarRating from "./StarRating";

const CarRatingBadge = ({ vin }: { vin: string }) => {
    const [average, setAverage] = useState<number | null>(null);
    const [count, setCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(`/api/reviews?car=${encodeURIComponent(vin)}&objects-per-page=100`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                const reviews: Review[] = data?.data ?? [];
                if (reviews.length) {
                    const avg = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
                    setAverage(avg);
                    setCount(reviews.length);
                }
                setLoaded(true);
            })
            .catch(() => { setLoaded(true); });
    }, [vin]);

    if (!loaded) return null;

    return (
        <div style={{ margin: "6px 0 10px" }}>
            <StarRating average={average ?? 0} count={count || undefined} size="sm" />
        </div>
    );
};

export default CarRatingBadge;
