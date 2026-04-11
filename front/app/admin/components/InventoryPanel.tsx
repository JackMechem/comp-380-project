"use client";

import { useEffect, useState } from "react";
import { getAllCars, deleteCar } from "../../lib/AdminApiCalls";
import { Car } from "@/app/types/CarTypes";
import { useAdminSidebarStore } from "@/stores/adminSidebarStore";
import Image from "next/image";
import Cookies from "js-cookie";
import {
    BiSearch, BiTrash, BiEdit, BiChevronDown, BiChevronUp,
    BiCar, BiRefresh,
} from "react-icons/bi";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block px-[8px] py-[2px] rounded-full bg-third/40 text-foreground text-[8pt] font-[500]">
        {children}
    </span>
);

// ── Expanded detail row ───────────────────────────────────────────────────────

const SKIP = new Set(["vin", "make", "model", "modelYear", "images", "pricePerDay", "vehicleClass", "description"]);

const ExpandedRow = ({ car }: { car: Car }) => {
    const details = Object.entries(car).filter(([k]) => !SKIP.has(k));
    return (
        <div className="px-[20px] py-[20px] bg-primary-dark/40 border-t border-third/40 grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {/* Spec grid */}
            <div className="md:col-span-2 flex flex-col gap-[16px]">
                {car.description && (
                    <div>
                        <p className="text-[8pt] font-[600] uppercase tracking-wider text-foreground-light mb-[4px]">Description</p>
                        <p className="text-[10pt] text-foreground leading-relaxed">{car.description}</p>
                    </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-[24px] gap-y-[12px]">
                    {details.map(([key, val]) => (
                        <div key={key}>
                            <p className="text-[7.5pt] font-[600] uppercase tracking-wider text-foreground-light">{fmt(key)}</p>
                            <p className="text-[10pt] text-foreground mt-[2px]">
                                {Array.isArray(val) ? (val.length ? val.join(", ") : "—") : String(val ?? "—")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image strip */}
            <div>
                <p className="text-[8pt] font-[600] uppercase tracking-wider text-foreground-light mb-[8px]">Gallery</p>
                {car.images?.length ? (
                    <div className="flex gap-[8px] overflow-x-auto pb-[4px] scrollbar-hide">
                        {car.images.map((url, i) => (
                            <div key={i} className="relative flex-shrink-0 w-[110px] h-[74px] rounded-xl overflow-hidden border border-third bg-third/20">
                                <Image src={url} alt="" fill className="object-cover" sizes="110px"
                                    onError={(e) => (e.currentTarget.style.display = "none")} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-foreground-light text-[10pt]">No images.</p>
                )}
            </div>
        </div>
    );
};

// ── Main panel ────────────────────────────────────────────────────────────────

const InventoryPanel = () => {
    const { openEditCar } = useAdminSidebarStore();

    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [query, setQuery] = useState("");
    const [expandedVin, setExpandedVin] = useState<string | null>(null);
    const [deletingVin, setDeletingVin] = useState<string | null>(null);
    const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
    const [checkingImages, setCheckingImages] = useState(false);
    const [imageCheckDone, setImageCheckDone] = useState(false);

    const checkImages = async () => {
        setCheckingImages(true);
        const broken = new Set<string>();
        await Promise.all(
            cars.map((car) =>
                new Promise<void>((resolve) => {
                    if (!car.images?.length) {
                        broken.add(car.vin);
                        return resolve();
                    }
                    const img = new window.Image();
                    img.onload = () => resolve();
                    img.onerror = () => { broken.add(car.vin); resolve(); };
                    img.src = car.images[0];
                })
            )
        );
        setBrokenImages(broken);
        setCheckingImages(false);
        setImageCheckDone(true);
    };

    const [credentials] = useState(() => {
        const raw = Cookies.get("credentials");
        return raw ? JSON.parse(raw) : { username: "", password: "" };
    });

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await getAllCars({ pageSize: 100 });
            setCars(res.data);
            setHasFetched(true);
            setBrokenImages(new Set());
            setImageCheckDone(false);
        } catch (e) {
            alert("Fetch failed: " + e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleDelete = async (vin: string) => {
        if (!window.confirm(`Delete vehicle ${vin}? This cannot be undone.`)) return;
        setDeletingVin(vin);
        try {
            await deleteCar(vin, credentials.username, credentials.password);
            setCars((prev) => prev.filter((c) => c.vin !== vin));
            if (expandedVin === vin) setExpandedVin(null);
        } catch (e) {
            alert("Error deleting: " + e);
        } finally {
            setDeletingVin(null);
        }
    };

    const filtered = cars.filter((c) =>
        `${c.make} ${c.model} ${c.vin} ${c.vehicleClass}`.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-[20px] pb-[40px]">
            {/* Header */}
            <div className="flex items-center justify-between gap-[12px] flex-wrap">
                <div>
                    <h2 className="text-foreground text-[16pt] font-[700]">Live Inventory</h2>
                    {hasFetched && (
                        <p className="text-foreground-light text-[10pt]">{filtered.length} of {cars.length} vehicles</p>
                    )}
                </div>
                <div className="flex gap-[8px]">
                    <button
                        onClick={checkImages}
                        disabled={checkingImages || !hasFetched}
                        title="Check all car images for broken URLs"
                        className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-xl border border-yellow-400/60 hover:bg-yellow-400/10 text-foreground text-[10pt] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {checkingImages ? (
                            <BiRefresh className="text-[14pt] animate-spin text-yellow-500" />
                        ) : (
                            <span className="w-[14px] h-[14px] rounded-full bg-yellow-400 flex items-center justify-center text-[7pt] font-[800] text-yellow-900 flex-shrink-0">!</span>
                        )}
                        {checkingImages ? "Checking…" : imageCheckDone ? "Recheck Images" : "Check Images"}
                    </button>
                    <button
                        onClick={fetchCars}
                        disabled={loading}
                        className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-xl border border-third hover:border-accent/40 hover:bg-accent/5 text-foreground text-[10pt] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <BiRefresh className={`text-[14pt] ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <BiSearch className="absolute left-[14px] top-1/2 -translate-y-1/2 text-foreground-light text-[13pt]" />
                <input
                    className="w-full bg-primary border border-third rounded-xl pl-[40px] pr-[14px] py-[10px] text-[10.5pt] text-foreground placeholder:text-foreground-light/60 focus:outline-none focus:border-accent/60 transition"
                    placeholder="Search by make, model, VIN or class…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            {!hasFetched && loading ? (
                <div className="flex flex-col gap-[8px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[64px] rounded-xl bg-third/20 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px] text-foreground-light gap-[8px]">
                    <BiCar className="text-[36pt] opacity-30" />
                    <p className="text-[11pt]">{hasFetched ? "No vehicles match your search." : "No data loaded."}</p>
                </div>
            ) : (
                <div className="bg-primary border border-third/60 rounded-2xl overflow-hidden">
                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-[16px] px-[20px] py-[12px] border-b border-third/50 bg-primary-dark/30">
                        {["Vehicle", "VIN", "Class", "Price / Day", ""].map((h) => (
                            <p key={h} className="text-[8pt] font-[600] uppercase tracking-wider text-foreground-light">{h}</p>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-third/40">
                        {filtered.map((car) => {
                            const isExpanded = expandedVin === car.vin;
                            const isDeleting = deletingVin === car.vin;
                            const hasNoImages = !car.images?.length;
                            const hasBrokenImage = brokenImages.has(car.vin);
                            const hasImageIssue = hasNoImages || hasBrokenImage;

                            return (
                                <div key={car.vin}>
                                    {/* Summary row */}
                                    <div
                                        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-[16px] px-[20px] py-[14px] items-center hover:bg-primary-dark/20 transition-colors cursor-pointer"
                                        onClick={() => setExpandedVin(isExpanded ? null : car.vin)}
                                    >
                                        {/* Vehicle */}
                                        <div className="flex items-center gap-[12px] min-w-0">
                                            <div className="relative flex-shrink-0 w-[52px] h-[36px] rounded-lg overflow-hidden bg-third/30 border border-third/40">
                                                {car.images?.[0] ? (
                                                    <Image src={car.images[0]} alt="" fill className="object-cover" sizes="52px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-foreground-light/40">
                                                        <BiCar className="text-[16pt]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex items-center gap-[8px]">
                                                <div className="min-w-0">
                                                    <p className="text-foreground text-[10.5pt] font-[600] truncate">{car.make} {car.model}</p>
                                                    <p className="text-foreground-light text-[9pt]">{car.modelYear}</p>
                                                </div>
                                                {hasImageIssue && (
                                                    <div
                                                        title={hasNoImages ? "No images" : "One or more images failed to load"}
                                                        className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-yellow-400 flex items-center justify-center text-[8pt] font-[800] text-yellow-900 leading-none"
                                                    >
                                                        !
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* VIN — hidden on mobile */}
                                        <p className="hidden md:block text-foreground-light text-[9.5pt] font-mono truncate">{car.vin}</p>

                                        {/* Class */}
                                        <div className="hidden md:block">
                                            <Badge>{car.vehicleClass}</Badge>
                                        </div>

                                        {/* Price */}
                                        <p className="hidden md:block text-accent font-[600] text-[11pt]">${car.pricePerDay}<span className="text-foreground-light font-[400] text-[9pt]">/day</span></p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-[6px]" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditCar(car.vin)}
                                                title="Edit"
                                                className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-foreground-light hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                                            >
                                                <BiEdit className="text-[14pt]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(car.vin)}
                                                title="Delete"
                                                disabled={isDeleting}
                                                className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-foreground-light hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                                            >
                                                {isDeleting
                                                    ? <BiRefresh className="text-[14pt] animate-spin" />
                                                    : <BiTrash className="text-[14pt]" />
                                                }
                                            </button>
                                            <span className="text-foreground-light/40 text-[12pt]">
                                                {isExpanded ? <BiChevronUp /> : <BiChevronDown />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && <ExpandedRow car={car} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPanel;
