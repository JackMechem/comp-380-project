"use client";

import { useState } from "react";
import { Review } from "@/app/types/ReviewTypes";
import { BiX } from "react-icons/bi";
import styles from "./reviews.module.css";

interface ReviewModalProps {
    vin: string;
    carName: string;
    acctId: number;
    userId: number;
    durationDays: number;
    existingReview?: Review | null;
    onClose: () => void;
    onSaved: (review: Review) => void;
    onDeleted?: () => void;
}

const ReviewModal = ({
    vin,
    carName,
    acctId,
    userId,
    durationDays,
    existingReview,
    onClose,
    onSaved,
    onDeleted,
}: ReviewModalProps) => {
    const isEdit = !!existingReview;
    const [stars, setStars] = useState(existingReview?.stars ?? 0);
    const [hoverStars, setHoverStars] = useState(0);
    const [title, setTitle] = useState(existingReview?.title ?? "");
    const [body, setBody] = useState(existingReview?.bodyOfText ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!stars) { setError("Please select a star rating."); return; }
        if (!title.trim()) { setError("Please enter a title."); return; }
        setError(null);
        setSubmitting(true);
        try {
            const authHeaders: HeadersInit = {
                "Content-Type": "application/json",
                credentials: "include",
            };

            let res: Response;
            if (isEdit && existingReview) {
                res = await fetch(`/api/reviews/${existingReview.reviewId}`, {
                    method: "PATCH",
                    headers: authHeaders,
                    body: JSON.stringify({ title: title.trim(), bodyOfText: body.trim(), stars }),
                    credentials: "include",
                });
            } else {
                res = await fetch("/api/reviews", {
                    method: "POST",
                    headers: authHeaders,
                    body: JSON.stringify({
                        account: acctId,
                        title: title.trim(),
                        bodyOfText: body.trim(),
                        stars,
                        car: vin,
                        rentalDuration: durationDays,
                        publishedDate: new Date().toISOString(),
                    }),
                    credentials: "include",
                });
            }

            if (!res.ok && res.status < 500) {
                const text = await res.text();
                setError(`Failed to ${isEdit ? "update" : "submit"} review (${res.status}): ${text}`);
                return;
            }

            // 2xx or 5xx — backend saved it; build the result from what we know
            if (isEdit && existingReview) {
                onSaved({ ...existingReview, title: title.trim(), bodyOfText: body.trim(), stars });
            } else {
                try {
                    const saved: Review = await res.json();
                    onSaved(saved);
                } catch {
                    // Body wasn't parseable (empty 201) — close and let the re-fetch pick it up
                    onClose();
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingReview) return;
        setDeleting(true);
        setError(null);
        try {
            const res = await fetch(`/api/reviews/${existingReview.reviewId}`, { method: "DELETE" });
            if (!res.ok && res.status < 500) {
                setError(`Failed to delete review (${res.status}).`);
                return;
            }
            onDeleted?.();
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setDeleting(false);
        }
    };

    const displayStars = hoverStars || stars;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div>
                        <p className={styles.modalTitle}>{isEdit ? "Edit Review" : "Leave a Review"}</p>
                        <p className={styles.modalSubtitle}>{carName}</p>
                    </div>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <BiX />
                    </button>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Rating</label>
                    <div className={styles.starPicker}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.starPickerBtn} ${displayStars > i ? styles.starPickerBtnActive : ""}`}
                                onClick={() => setStars(i + 1)}
                                onMouseEnter={() => setHoverStars(i + 1)}
                                onMouseLeave={() => setHoverStars(0)}
                                aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Title</label>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Summarize your experience"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={120}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Review (optional)</label>
                    <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="Tell us more about your experience..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}

                <div className={styles.modalActions}>
                    {isEdit && (
                        <button
                            className={styles.deleteBtn}
                            onClick={handleDelete}
                            disabled={submitting || deleting}
                            style={{ marginRight: "auto" }}
                        >
                            {deleting ? "Deleting…" : "Delete"}
                        </button>
                    )}
                    <button className={styles.cancelBtn} onClick={onClose} disabled={submitting || deleting}>
                        Cancel
                    </button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting || deleting}>
                        {submitting ? "Saving…" : isEdit ? "Save Changes" : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
