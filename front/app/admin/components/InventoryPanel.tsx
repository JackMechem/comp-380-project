"use client";

import { useState, useEffect } from "react";
import { deleteCar, updateCarStatus } from "@/app/lib/AdminApiCalls";
import { CarStatus } from "@/app/types/CarTypes";
import BulkActionsBar from "./BulkActionsBar";
import { Car } from "@/app/types/CarTypes";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import Image from "next/image";
import {
    BiSearch,
    BiTrash,
    BiEdit,
    BiChevronDown,
    BiChevronUp,
    BiCar,
    BiRefresh,
} from "react-icons/bi";

import styles from "./inventoryPanel.module.css";
import { LoadingSkeleton, EmptyState } from "./PanelLoading";

// ── Status helpers ────────────────────────────────────────────────────────────

const CAR_STATUSES: CarStatus[] = ["AVAILABLE", "DISABLED", "ARCHIVED", "LOANED", "SERVICE"];

const STATUS_COLORS: Record<CarStatus, { bg: string; color: string }> = {
    AVAILABLE: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
    DISABLED:  { bg: "rgba(234,179,8,0.12)",  color: "#eab308" },
    ARCHIVED:  { bg: "rgba(107,114,128,0.12)", color: "#6b7280" },
    LOANED:    { bg: "rgba(59,130,246,0.12)",  color: "#3b82f6" },
    SERVICE:   { bg: "rgba(249,115,22,0.12)",  color: "#f97316" },
};

const StatusBadge = ({ status }: { status?: CarStatus }) => {
    const s = status ?? "AVAILABLE";
    const c = STATUS_COLORS[s] ?? STATUS_COLORS.AVAILABLE;
    return (
        <span style={{
            padding: "2px 10px", borderRadius: 9999, fontSize: "8pt",
            fontWeight: 600, backgroundColor: c.bg, color: c.color,
            textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
            {s}
        </span>
    );
};

// ── Expanded detail row ───────────────────────────────────────────────────────

const SKIP = new Set([
    "vin",
    "make",
    "model",
    "modelYear",
    "images",
    "pricePerDay",
    "vehicleClass",
    "carStatus",
    "description",
]);

interface ExpandedRowProps {
    car: Car;
    onStatusChange: (vin: string, status: CarStatus) => Promise<void>;
}

const ExpandedRow = ({ car, onStatusChange }: ExpandedRowProps) => {
    const [changingStatus, setChangingStatus] = useState(false);
    const details = Object.entries(car).filter(([k]) => !SKIP.has(k));

    const handleStatusChange = async (newStatus: CarStatus) => {
        setChangingStatus(true);
        try {
            await onStatusChange(car.vin, newStatus);
        } finally {
            setChangingStatus(false);
        }
    };

    return (
        <div className={styles.expandedSection}>
            <div className={styles.descriptionWrapper}>
                {/* Status changer */}
                <div style={{ marginBottom: 12 }}>
                    <p className={styles.columnLabel}>Status</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <select
                            style={{
                                padding: "4px 10px", borderRadius: 8, fontSize: "10pt",
                                border: "1px solid var(--color-third)",
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-foreground)",
                                cursor: changingStatus ? "wait" : "pointer",
                            }}
                            value={car.carStatus ?? "AVAILABLE"}
                            disabled={changingStatus}
                            onChange={(e) => handleStatusChange(e.target.value as CarStatus)}
                        >
                            {CAR_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {changingStatus && <BiRefresh className={styles.spinning} style={{ fontSize: "14pt" }} />}
                    </div>
                </div>

                {car.description && (
                    <div>
                        <p className={styles.columnLabel}>Description</p>
                        <p className={styles.descriptionText}>{car.description}</p>
                    </div>
                )}
                <div className={styles.detailsGrid}>
                    {details.map(([key, val]) => (
                        <div key={key}>
                            <p className={styles.columnLabel}>
                                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </p>
                            <p className={styles.detailValue}>
                                {Array.isArray(val)
                                    ? val.length
                                        ? val.join(", ")
                                        : "—"
                                    : String(val ?? "—")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className={styles.columnLabel}>Gallery</p>
                {car.images?.length ? (
                    <div className={styles.galleryScroll}>
                        {car.images.map((url, i) => (
                            <div
                                key={i}
                                className={styles.thumbnail}
                                style={{ width: "110px", height: "74px" }}
                            >
                                <Image
                                    src={url}
                                    alt=""
                                    fill
                                    className={styles.objectCover}
                                    sizes="110px"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.subtitle}>No images.</p>
                )}
            </div>
        </div>
    );
};

// ── Main panel ────────────────────────────────────────────────────────────────

interface Props {
    cars: Car[];
    onRefresh: () => Promise<void>;
    role: string;
}

const InventoryPanel = ({ cars: initialCars, onRefresh, role }: Props) => {
    const isAdmin = role === "ADMIN";
    const { openEditCar } = useUserDashboardStore();
    const [cars, setCars] = useState<Car[]>(initialCars);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [expandedVin, setExpandedVin] = useState<string | null>(null);
    const [deletingVin, setDeletingVin] = useState<string | null>(null);
    const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
    const [checkingImages, setCheckingImages] = useState(false);
    const [imageCheckDone, setImageCheckDone] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Sync when parent re-fetches
    useEffect(() => {
        setCars(initialCars);
        setBrokenImages(new Set());
        setImageCheckDone(false);
    }, [initialCars]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            await onRefresh(); // parent updates initialCars → useEffect above syncs
        } catch (e) {
            alert("Fetch failed: " + e);
        } finally {
            setLoading(false);
        }
    };

    const checkImages = async () => {
        setCheckingImages(true);
        const broken = new Set<string>();
        await Promise.all(
            cars.map(
                (car) =>
                    new Promise<void>((resolve) => {
                        if (!car.images?.length) {
                            broken.add(car.vin);
                            return resolve();
                        }
                        const img = new window.Image();
                        img.onload = () => resolve();
                        img.onerror = () => {
                            broken.add(car.vin);
                            resolve();
                        };
                        img.src = car.images[0];
                    }),
            ),
        );
        setBrokenImages(broken);
        setCheckingImages(false);
        setImageCheckDone(true);
    };


    const handleStatusChange = async (vin: string, status: CarStatus) => {
        try {
            await updateCarStatus(vin, status);
            setCars((prev) => prev.map((c) => c.vin === vin ? { ...c, carStatus: status } : c));
        } catch (e) {
            alert("Error updating status: " + e);
        }
    };

    const handleDelete = async (vin: string) => {
        if (!window.confirm(`Delete vehicle ${vin}?`)) return;
        setDeletingVin(vin);
        try {
            await deleteCar(vin);
            setCars((prev) => prev.filter((c) => c.vin !== vin));
            setSelected((prev) => { const n = new Set(prev); n.delete(vin); return n; });
        } catch (e) {
            alert("Error: " + e);
        } finally {
            setDeletingVin(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.size} vehicle${selected.size !== 1 ? "s" : ""}? This cannot be undone.`)) return;
        setBulkDeleting(true);
        const vins = [...selected];
        const results = await Promise.allSettled(vins.map((vin) => deleteCar(vin)));
        const deleted = vins.filter((_, i) => results[i].status === "fulfilled");
        const failed = vins.filter((_, i) => results[i].status === "rejected");
        setCars((prev) => prev.filter((c) => !deleted.includes(c.vin)));
        setSelected(new Set(failed));
        setBulkDeleting(false);
        if (failed.length) alert(`${failed.length} deletion(s) failed.`);
    };

    const toggleSelect = (vin: string) =>
        setSelected((prev) => { const n = new Set(prev); n.has(vin) ? n.delete(vin) : n.add(vin); return n; });

    const filtered = cars.filter((c) =>
        `${c.make} ${c.model} ${c.vin} ${c.vehicleClass}`
            .toLowerCase()
            .includes(query.toLowerCase()),
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className="page-title">Live Inventory</h2>
                    <p className="page-subtitle">
                        {filtered.length} of {cars.length} vehicles
                    </p>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={checkImages}
                        disabled={checkingImages}
                        className={`${styles.btn} ${styles.btnCheck}`}
                    >
                        {checkingImages ? (
                            <BiRefresh className={`${styles.spinning} ${styles.textYellow}`} />
                        ) : (
                            <span className={styles.statusDot}>!</span>
                        )}
                        {checkingImages
                            ? "Checking…"
                            : imageCheckDone
                                ? "Recheck Images"
                                : "Check Images"}
                    </button>
                    <button
                        onClick={fetchCars}
                        disabled={loading}
                        className={`${styles.btn} ${styles.btnRefresh}`}
                    >
                        <BiRefresh className={loading ? styles.spinning : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className={styles.searchWrapper}>
                <BiSearch className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    placeholder="Search by make, model, VIN or class…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {selected.size > 0 && isAdmin && (
                <BulkActionsBar
                    count={selected.size}
                    deleting={bulkDeleting}
                    onDelete={handleBulkDelete}
                    onClear={() => setSelected(new Set())}
                />
            )}

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader} style={{ gridTemplateColumns: "28px 2fr 1fr 0.8fr 0.8fr 0.8fr auto" }}>
                    <div className={styles.cbCell}>
                        <input
                            type="checkbox"
                            className={styles.cb}
                            checked={filtered.length > 0 && filtered.every((c) => selected.has(c.vin))}
                            onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((c) => c.vin)) : new Set())}
                        />
                    </div>
                    {["Vehicle", "VIN", "Class", "Status", "Price / Day", ""].map((h) => (
                        <p key={h} className={styles.columnLabel}>{h}</p>
                    ))}
                </div>

                <div className={styles.rowList}>
                    {loading ? (
                        <LoadingSkeleton label="Refreshing inventory…" />
                    ) : filtered.length === 0 ? (
                        <EmptyState icon={<BiCar />} message="No vehicles match your search." />
                    ) : filtered.map((car) => {
                        const isExpanded = expandedVin === car.vin;
                        const hasImageIssue = !car.images?.length || brokenImages.has(car.vin);

                        return (
                            <div key={car.vin}>
                                <div
                                    className={styles.summaryRow}
                                    style={{ gridTemplateColumns: "28px 2fr 1fr 0.8fr 0.8fr 0.8fr auto" }}
                                    onClick={() => setExpandedVin(isExpanded ? null : car.vin)}
                                >
                                    <div className={styles.cbCell} onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className={styles.cb}
                                            checked={selected.has(car.vin)}
                                            onChange={() => toggleSelect(car.vin)}
                                        />
                                    </div>
                                    <div className={styles.vehicleCell}>
                                        <div
                                            className={styles.thumbnail}
                                            style={{ width: "52px", height: "36px" }}
                                        >
                                            {car.images?.[0] ? (
                                                <Image
                                                    src={car.images[0]}
                                                    alt=""
                                                    fill
                                                    className={styles.objectCover}
                                                    sizes="52px"
                                                />
                                            ) : (
                                                <div className={styles.placeholderIconWrapper}>
                                                    <BiCar />
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.imageInfoWrapper}>
                                            <div className={styles.minWidthZero}>
                                                <p className={styles.carTitle}>
                                                    {car.make} {car.model}
                                                </p>
                                                <p className={styles.carYear}>
                                                    {car.modelYear}
                                                </p>
                                            </div>
                                            {hasImageIssue && (
                                                <div className={styles.statusDot}>!</div>
                                            )}
                                        </div>
                                    </div>

                                    <p className={`${styles.carYear} ${styles.vinText}`}>
                                        {car.vin}
                                    </p>

                                    <div className={styles.hideMobile}>
                                        <span className={styles.badge}>{car.vehicleClass}</span>
                                    </div>

                                    <div className={styles.hideMobile}>
                                        <StatusBadge status={car.carStatus} />
                                    </div>

                                    <p className={`${styles.priceText} ${styles.hideMobile}`}>
                                        ${car.pricePerDay}
                                        <span className={styles.perDay}>/day</span>
                                    </p>

                                    <div
                                        className={styles.actionGroup}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => openEditCar(car.vin)}
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                        >
                                            <BiEdit />
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(car.vin)}
                                                disabled={deletingVin === car.vin}
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            >
                                                {deletingVin === car.vin ? (
                                                    <BiRefresh className={styles.spinning} />
                                                ) : (
                                                    <BiTrash />
                                                )}
                                            </button>
                                        )}
                                        <span className={styles.chevronIcon}>
                                            {isExpanded ? <BiChevronUp /> : <BiChevronDown />}
                                        </span>
                                    </div>
                                </div>
                                {isExpanded && <ExpandedRow car={car} onStatusChange={handleStatusChange} />}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default InventoryPanel;
