"use client";

import { useState, useEffect } from "react";
import { buildCsv, downloadData, safeFilename } from "../table/exportUtils";
import DatePicker from "@/app/components/DatePicker";
import { BiDownload, BiRefresh } from "react-icons/bi";

// ── Review pool ───────────────────────────────────────────────────────────────

const REVIEW_POOL: { body: string; title: string; stars: number }[] = [
    { body: "Took it on some rough trails and it didn't flinch once.", title: "Conquered everything", stars: 5 },
    { body: "Big comfortable and easy to drive despite its size. Great for road trips.", title: "Commanding presence", stars: 4 },
    { body: "Faster than anything I've driven before. Loved every second.", title: "Absolutely quick", stars: 5 },
    { body: "Nothing like the feel of a true performance machine. Would rent again.", title: "Raw and exciting", stars: 4 },
    { body: "The acceleration is savage and the sound is music to my ears.", title: "Incredible machine", stars: 5 },
    { body: "This car is incredible. Every corner every straightaway it delivers.", title: "Pure driving bliss", stars: 5 },
    { body: "Commanding yet refined. The interior quality is outstanding.", title: "Effortless elegance", stars: 5 },
    { body: "This car does everything brilliantly without breaking a sweat.", title: "Quiet confidence", stars: 4 },
    { body: "Long highway stretches feel like nothing in this car. Exceptional.", title: "Pure comfort", stars: 5 },
    { body: "Every detail is perfect. I felt like royalty the entire time.", title: "Rolling first class", stars: 5 },
    { body: "This thing climbed terrain I didn't think was possible for a rental.", title: "Go-anywhere attitude", stars: 4 },
    { body: "More fun than it looks. Nippy in the city and easy on gas.", title: "Practical and fun", stars: 4 },
    { body: "Not exciting but does everything well. Perfect city runabout.", title: "Sensible pick", stars: 3 },
    { body: "Exactly what I needed. Fuel efficient and surprisingly fun to drive.", title: "Great value", stars: 4 },
    { body: "Easy to park cheap to run and comfortable enough for daily use.", title: "Smart choice", stars: 4 },
    { body: "No frills no fuss. Just a solid reliable car for getting around.", title: "Does the job", stars: 3 },
    { body: "Four-wheel drive engaged and nothing could stop us. Brilliant off-roader.", title: "Unstoppable", stars: 5 },
    { body: "Massive interior with tons of cargo room. Perfect for the whole family.", title: "Space for days", stars: 4 },
    { body: "Clean fast and tech-forward. This is how cars should be.", title: "Zero regrets", stars: 5 },
    { body: "Supremely comfortable. The cabin is quiet and the ride is silky smooth.", title: "Pampered in style", stars: 5 },
    { body: "Capable beyond what I expected. Ground clearance is impressive.", title: "Trail beast", stars: 4 },
    { body: "Ate up the miles without any fuss. Passengers were very comfortable.", title: "Smooth cruiser", stars: 4 },
    { body: "Handles like it was born on a circuit. The power is addictive.", title: "Track-ready monster", stars: 5 },
    { body: "The acceleration is unlike anything from a combustion engine.", title: "Electrifying experience", stars: 5 },
    { body: "Huge but surprisingly agile. Very refined for a full-size vehicle.", title: "Effortless hauler", stars: 4 },
    { body: "Range was better than expected and charging was convenient.", title: "Future is now", stars: 4 },
    { body: "Handles beautifully in the corners and has power to spare.", title: "Driver's car", stars: 5 },
    { body: "Felt safe and confident in all conditions. Highly recommended.", title: "Total confidence", stars: 4 },
    { body: "The interior is a great place to spend long hours. Very refined.", title: "Cabin excellence", stars: 4 },
    { body: "Turned heads everywhere we went. A real showstopper.", title: "Head-turner", stars: 5 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function q(s: string) {
    return '"' + s.replace(/"/g, '""') + '"';
}

function spreadTs(start: Date, end: Date, i: number, n: number): number {
    if (n === 1) return Math.floor(start.getTime() / 1000);
    return Math.floor((start.getTime() + i * (end.getTime() - start.getTime()) / (n - 1)) / 1000);
}

function spreadDate(start: Date, end: Date, i: number, n: number): Date {
    if (n === 1) return start;
    return new Date(start.getTime() + i * (end.getTime() - start.getTime()) / (n - 1));
}

function toDateStr(d: Date) {
    return d.toISOString().slice(0, 10);
}

function fakePid(i: number, batchTs: string) {
    const rand = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
    return `in_gen${batchTs}${String(i).padStart(3, "0")}${rand}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CsvGeneratorPanel() {
    const [userId, setUserId]     = useState("2");
    const [accountId, setAccountId] = useState("1");
    const [count, setCount]       = useState("30");
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 10, 1)); // Nov 1 2025
    const [endDate, setEndDate]   = useState<Date | undefined>(new Date(2026, 3, 27));   // Apr 27 2026
    const [vins, setVins]         = useState<string[]>([]);
    const [loading, setLoading]   = useState(false);
    const [vinError, setVinError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/cars", { cache: "no-store" })
            .then(r => r.json())
            .then(data => {
                const list: string[] = (Array.isArray(data) ? data : (data.data ?? []))
                    .map((c: { vin?: string }) => c.vin)
                    .filter(Boolean);
                if (list.length === 0) setVinError("No cars found in database.");
                setVins(list);
            })
            .catch(() => setVinError("Failed to fetch cars from database."));
    }, []);

    const generate = () => {
        if (!startDate || !endDate || startDate >= endDate) {
            alert("Please choose a valid date range.");
            return;
        }
        const n = Math.max(1, Math.min(500, parseInt(count) || 30));
        if (vins.length === 0) { alert("No VINs loaded yet."); return; }

        setLoading(true);
        try {
            // Pick n random VINs (with replacement if needed)
            const picked: string[] = Array.from({ length: n }, (_, i) =>
                vins[Math.floor(Math.random() * vins.length)]
            );

            // Durations cycle 2-7 days
            const durations = Array.from({ length: n }, (_, i) => (i % 6) + 2);

            // Pickup spread across start → end-7d so dropoff fits
            const pickupEnd = new Date(endDate.getTime() - 7 * 86400000);
            const pickupRange = pickupEnd > startDate ? pickupEnd : startDate;

            // ── payments.csv ──────────────────────────────────────────────
            const paymentHeaders = ["Payment ID", "Type", "Total", "Amount Paid", "Paid", "Date"];
            const totals = Array.from({ length: n }, () => Math.floor(Math.random() * 450) + 50);
            const batchTs = Date.now().toString(36).slice(-6);
            const pids = Array.from({ length: n }, (_, i) => fakePid(i, batchTs));
            const paymentRows = Array.from({ length: n }, (_, i) => {
                const dt = toDateStr(spreadDate(startDate, endDate, i, n));
                return [pids[i], "INVOICE", String(totals[i]), String(totals[i]), "true", dt];
            });

            // ── reservations.csv ──────────────────────────────────────────
            const resHeaders = ["Res #", "Car", "User ID", "Pick-up", "Drop-off", "Days", "Booked", "Payments"];
            const resRows = Array.from({ length: n }, (_, i) => {
                const dur = durations[i];
                const pickup  = spreadDate(startDate, pickupRange, i, n);
                const dropoff = new Date(pickup.getTime() + dur * 86400000);
                const booked  = new Date(pickup.getTime() - 4 * 86400000);
                return [
                    "",
                    picked[i],
                    userId,
                    toDateStr(pickup),
                    toDateStr(dropoff),
                    String(dur),
                    toDateStr(booked),
                    `["${pids[i]}"]`,
                ];
            });

            // ── reviews.csv ───────────────────────────────────────────────
            const revHeaders = ["ID", "Body", "Account", "Car (VIN)", "Stars", "Title", "Duration", "Published"];
            const revRows = Array.from({ length: n }, (_, i) => {
                const review = REVIEW_POOL[i % REVIEW_POOL.length];
                const ts = spreadTs(startDate, endDate, i, n);
                return ["", review.body, accountId, picked[i], String(review.stars), review.title, "1", String(ts)];
            });

            // ── download ──────────────────────────────────────────────────
            downloadData(buildCsv(paymentHeaders, paymentRows),   "text/csv", "generated_payments.csv");
            setTimeout(() => {
                downloadData(buildCsv(resHeaders, resRows),       "text/csv", "generated_reservations.csv");
                setTimeout(() => {
                    downloadData(buildCsv(revHeaders, revRows),   "text/csv", "generated_reviews.csv");
                }, 150);
            }, 150);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        background: "var(--color-primary-dark)",
        border: "1px solid var(--color-third)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 14,
        color: "var(--color-foreground)",
        width: "100%",
        boxSizing: "border-box",
        outline: "none",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-foreground-light)",
        marginBottom: 6,
        display: "block",
    };

    const fieldWrap: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
    };

    return (
        <div style={{ maxWidth: 640 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>CSV Generator</h2>
            <p style={{ fontSize: 13, color: "var(--color-foreground-light)", marginBottom: 28, lineHeight: 1.6 }}>
                Generates linked <strong>payments</strong>, <strong>reservations</strong>, and <strong>reviews</strong> CSV files
                ready to import into the table views. VINs are picked randomly from the database.
            </p>

            {vinError && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 20 }}>
                    {vinError}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* User ID */}
                <div style={fieldWrap}>
                    <label style={labelStyle}>User ID</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="1"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        placeholder="2"
                    />
                </div>

                {/* Account ID */}
                <div style={fieldWrap}>
                    <label style={labelStyle}>Account ID</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="1"
                        value={accountId}
                        onChange={e => setAccountId(e.target.value)}
                        placeholder="1"
                    />
                </div>

                {/* Count */}
                <div style={fieldWrap}>
                    <label style={labelStyle}>Number of Records</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="1"
                        max="500"
                        value={count}
                        onChange={e => setCount(e.target.value)}
                        placeholder="30"
                    />
                </div>

                {/* Spacer */}
                <div />

                {/* Start date */}
                <div style={fieldWrap}>
                    <DatePicker
                        label="Start Date"
                        selected={startDate}
                        onSelect={setStartDate}
                        allowPast
                    />
                </div>

                {/* End date */}
                <div style={fieldWrap}>
                    <DatePicker
                        label="End Date"
                        selected={endDate}
                        onSelect={setEndDate}
                        fromDate={startDate}
                        allowPast
                    />
                </div>
            </div>

            {/* Info */}
            <div style={{ background: "var(--color-primary-dark)", border: "1px solid var(--color-third)", borderRadius: 10, padding: "12px 16px", fontSize: 12.5, color: "var(--color-foreground-light)", marginBottom: 24, lineHeight: 1.7 }}>
                <strong style={{ color: "var(--color-foreground)" }}>What gets generated:</strong>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
                    <li><strong>payments.csv</strong> — N payments with random totals, dates evenly spread across range</li>
                    <li><strong>reservations.csv</strong> — N reservations linked 1-to-1 with payments, 2–7 day durations</li>
                    <li><strong>reviews.csv</strong> — N reviews cycling through {REVIEW_POOL.length} preset review texts, timestamps spread across range</li>
                </ul>
                <p style={{ marginTop: 8, marginBottom: 0 }}>
                    {vins.length > 0
                        ? <><strong style={{ color: "var(--color-foreground)" }}>{vins.length}</strong> VINs loaded — picked randomly per row</>
                        : "Loading VINs from database…"
                    }
                </p>
            </div>

            {/* Generate button */}
            <button
                onClick={generate}
                disabled={loading || vins.length === 0}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 22px",
                    background: "var(--color-accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading || vins.length === 0 ? "not-allowed" : "pointer",
                    opacity: loading || vins.length === 0 ? 0.6 : 1,
                }}
            >
                <BiDownload style={{ fontSize: 17 }} />
                {loading ? "Generating…" : "Generate & Download CSVs"}
            </button>
        </div>
    );
}
