"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAllCars, getCarAdmin, getFilteredCarsAdmin, deleteCar, editCar } from "@/app/lib/AdminApiCalls";
import { Car, CarStatus } from "@/app/types/CarTypes";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import SpreadsheetTable, { Column, RowEdit } from "./SpreadsheetTable";
import styles from "./spreadsheetTable.module.css";
import { BiSearch, BiX } from "react-icons/bi";

// ── Status badge ─────────────────────────────────────────────────────────────

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
        <span
            className={styles.statusBadge}
            style={{ backgroundColor: c.bg, color: c.color }}
        >
            {s}
        </span>
    );
};

// ── Column definitions ───────────────────────────────────────────────────────

const CAR_COLUMNS: Column<Car>[] = [
    { key: "vin",          label: "VIN",          defaultVisible: true,  render: (c) => c.vin, minWidth: 170 },
    { key: "make",         label: "Make",         defaultVisible: true,  render: (c) => c.make,      editable: true, editType: "text",   getValue: (c) => c.make },
    { key: "model",        label: "Model",        defaultVisible: true,  render: (c) => c.model,     editable: true, editType: "text",   getValue: (c) => c.model },
    { key: "modelYear",    label: "Year",         defaultVisible: true,  render: (c) => c.modelYear, editable: true, editType: "number", getValue: (c) => c.modelYear },
    { key: "vehicleClass", label: "Class",        defaultVisible: true,  render: (c) => <span className={styles.badge}>{c.vehicleClass}</span>, editable: true, editType: "select", editOptions: ["ECONOMY", "LUXURY", "PERFORMANCE", "OFFROAD", "FULL_SIZE", "ELECTRIC"], getValue: (c) => c.vehicleClass ?? "" },
    { key: "carStatus",    label: "Status",       defaultVisible: true,  render: (c) => <StatusBadge status={c.carStatus} />, editable: true, editType: "select", editOptions: ["AVAILABLE", "DISABLED", "ARCHIVED", "LOANED", "SERVICE"], getValue: (c) => c.carStatus ?? "" },
    { key: "pricePerDay",  label: "Price / Day",  defaultVisible: true,  render: (c) => <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>${c.pricePerDay}</span>, editable: true, editType: "number", getValue: (c) => c.pricePerDay },
    { key: "bodyType",     label: "Body Type",    defaultVisible: false, render: (c) => c.bodyType ? <span className={styles.badge}>{c.bodyType}</span> : "—",        editable: true, editType: "select", editOptions: ["SEDAN", "SUV", "TRUCK", "CONVERTIBLE", "HATCHBACK", "FULL_SIZE", "COMPACT", "WAGON", "ELECTRIC", "COUPE"], getValue: (c) => c.bodyType ?? "" },
    { key: "transmission", label: "Transmission", defaultVisible: false, render: (c) => c.transmission ? <span className={styles.badge}>{c.transmission}</span> : "—", editable: true, editType: "select", editOptions: ["AUTOMATIC", "MANUAL"], getValue: (c) => String(c.transmission ?? "") },
    { key: "drivetrain",   label: "Drivetrain",   defaultVisible: false, render: (c) => c.drivetrain ? <span className={styles.badge}>{c.drivetrain}</span> : "—",    editable: true, editType: "select", editOptions: ["FWD", "RWD", "AWD"], getValue: (c) => String(c.drivetrain ?? "") },
    { key: "engineLayout", label: "Engine",       defaultVisible: false, render: (c) => c.engineLayout ? <span className={styles.badge}>{c.engineLayout}</span> : "—", editable: true, editType: "select", editOptions: ["V", "INLINE", "FLAT", "SINGLE_MOTOR", "DUAL_MOTOR"], getValue: (c) => String(c.engineLayout ?? "") },
    { key: "fuel",         label: "Fuel",         defaultVisible: false, render: (c) => c.fuel ? <span className={styles.badge}>{c.fuel}</span> : "—",                editable: true, editType: "select", editOptions: ["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"], getValue: (c) => String(c.fuel ?? "") },
    { key: "roofType",     label: "Roof",         defaultVisible: false, render: (c) => c.roofType ? <span className={styles.badge}>{c.roofType}</span> : "—",        editable: true, editType: "select", editOptions: ["SOFTTOP", "HARDTOP", "TARGA", "SLICKTOP", "SUNROOF", "PANORAMIC"], getValue: (c) => c.roofType ?? "" },
    { key: "cylinders",    label: "Cylinders",    defaultVisible: false, render: (c) => c.cylinders ?? "—",  editable: true, editType: "number", getValue: (c) => c.cylinders ?? "" },
    { key: "gears",        label: "Gears",        defaultVisible: false, render: (c) => c.gears ?? "—",      editable: true, editType: "number", getValue: (c) => c.gears ?? "" },
    { key: "horsepower",   label: "HP",           defaultVisible: false, render: (c) => c.horsepower ?? "—", editable: true, editType: "number", getValue: (c) => c.horsepower ?? "" },
    { key: "torque",       label: "Torque",       defaultVisible: false, render: (c) => c.torque ?? "—",     editable: true, editType: "number", getValue: (c) => c.torque ?? "" },
    { key: "seats",        label: "Seats",        defaultVisible: false, render: (c) => c.seats ?? "—",      editable: true, editType: "number", getValue: (c) => c.seats ?? "" },
    { key: "mpg",          label: "MPG",          defaultVisible: false, render: (c) => c.mpg ?? "—",        editable: true, editType: "number", getValue: (c) => c.mpg ?? "" },
    { key: "features",     label: "Features",     defaultVisible: false, render: (c) => <span className={styles.truncatedCell}>{c.features?.join(", ") || "—"}</span>, minWidth: 160 },
    { key: "images",       label: "Images",       defaultVisible: false, render: (c) => c.images?.length ?? 0 },
    { key: "description",  label: "Description",  defaultVisible: false, render: (c) => <span className={styles.truncatedCell}>{c.description || "—"}</span>, minWidth: 200, editable: true, editType: "textarea", getValue: (c) => c.description ?? "" },
];

// ── Search modes ─────────────────────────────────────────────────────────────

type SearchMode = "search" | "vin";

// ── Panel ────────────────────────────────────────────────────────────────────

interface Props {
    role: string;
}

const InventoryPanel = ({ role }: Props) => {
    const isAdmin = role === "ADMIN";
    const { openEditCar } = useUserDashboardStore();

    // Data
    const [cars, setCars] = useState<Car[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Search
    const [searchMode, setSearchMode] = useState<SearchMode>("search");
    const [query, setQuery] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [vinResult, setVinResult] = useState<Car[] | null>(null);

    // Selection
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Sort
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // Cancel any in-flight fetch when a new one starts
    const fetchIdRef = useRef(0);

    // Fetch paginated list
    const fetchPage = useCallback(async (p: number, ps: number, search: string, sb: string | null, sd: "asc" | "desc", isRefresh = false) => {
        const id = ++fetchIdRef.current;
        if (isRefresh) setRefreshing(true); else setLoading(true);
        setVinResult(null);
        try {
            const params: Record<string, string | number | undefined> = {
                page: p,
                pageSize: ps,
            };
            if (search) params.search = search;
            if (sb) { params.sortBy = sb; params.sortDir = sd; }
            const res = await getFilteredCarsAdmin(params);
            if (fetchIdRef.current !== id) return; // stale response
            setCars(res.data);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } catch (e) {
            if (fetchIdRef.current !== id) return;
            alert("Failed to fetch inventory: " + e);
        } finally {
            if (fetchIdRef.current === id) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    // Fetch by VIN
    const fetchByVin = useCallback(async (vin: string) => {
        const id = ++fetchIdRef.current;
        setLoading(true);
        setVinResult(null);
        try {
            const car = await getCarAdmin(vin.trim());
            if (fetchIdRef.current !== id) return;
            setVinResult([car]);
            setCars([car]);
            setTotalPages(1);
            setTotalItems(1);
        } catch {
            if (fetchIdRef.current !== id) return;
            setVinResult([]);
            setCars([]);
            setTotalPages(0);
            setTotalItems(0);
        } finally {
            if (fetchIdRef.current === id) {
                setLoading(false);
            }
        }
    }, []);

    // Initial load
    useEffect(() => { fetchPage(page, pageSize, "", null, "asc"); }, []);

    const handlePageChange = (p: number) => {
        setPage(p);
        setSelected(new Set());
        fetchPage(p, pageSize, activeSearch, sortBy, sortDir);
    };

    const handlePageSizeChange = (ps: number) => {
        setPageSize(ps);
        setPage(1);
        setSelected(new Set());
        fetchPage(1, ps, activeSearch, sortBy, sortDir);
    };

    const handleRefresh = () => {
        if (vinResult !== null && searchMode === "vin" && activeSearch) {
            fetchByVin(activeSearch);
        } else {
            fetchPage(page, pageSize, activeSearch, sortBy, sortDir, true);
        }
    };

    const handleSortChange = (col: string, dir: "asc" | "desc") => {
        setSortBy(col); setSortDir(dir); setPage(1);
        fetchPage(1, pageSize, activeSearch, col, dir);
    };

    const handleSearchSubmit = () => {
        const q = query.trim();
        setActiveSearch(q);
        setPage(1);
        setSelected(new Set());
        if (!q) {
            fetchPage(1, pageSize, "", sortBy, sortDir);
            return;
        }
        if (searchMode === "vin") {
            fetchByVin(q);
        } else {
            fetchPage(1, pageSize, q, sortBy, sortDir);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearchSubmit();
    };

    const handleClearSearch = () => {
        setQuery("");
        setActiveSearch("");
        setVinResult(null);
        setPage(1);
        fetchPage(1, pageSize, "", sortBy, sortDir);
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        const vins = [...selected] as string[];
        if (!window.confirm(`Delete ${vins.length} vehicle${vins.length !== 1 ? "s" : ""}? This cannot be undone.`)) return;
        setBulkDeleting(true);
        const results = await Promise.allSettled(vins.map((vin) => deleteCar(vin)));
        const failed = vins.filter((_, i) => results[i].status === "rejected");
        setBulkDeleting(false);
        if (failed.length) alert(`${failed.length} deletion(s) failed.`);
        setSelected(new Set(failed));
        handleRefresh();
    };

    // Single delete
    const handleDeleteOne = async (car: Car) => {
        if (!window.confirm(`Delete vehicle ${car.vin}?`)) return;
        try {
            await deleteCar(car.vin);
            handleRefresh();
        } catch (e) {
            alert("Delete failed: " + e);
        }
    };

    // Edit
    const handleEdit = (car: Car) => openEditCar(car.vin);

    // Inline edit mode save
    const handleSaveEdits = async (edits: RowEdit<Car>[]) => {
        await Promise.all(edits.map(({ original, patch }) =>
            editCar({ ...original, ...patch } as Car)
        ));
        handleRefresh();
    };

    // Custom search bar with mode dropdown
    const searchBar = (
        <div className={styles.searchCombo}>
            <div className={styles.ctxSection}>Search</div>
            <div className={styles.ctxDivider} />
            <div className={styles.searchModeRow}>
                <span className={styles.searchModeLabel}>By</span>
                <select
                    className={styles.searchModeSelect}
                    value={searchMode}
                    onChange={(e) => {
                        setSearchMode(e.target.value as SearchMode);
                        if (query) handleClearSearch();
                    }}
                >
                    <option value="search">Make &amp; Model</option>
                    <option value="vin">VIN</option>
                </select>
            </div>
            <div className={styles.searchWrapper}>
                <BiSearch className={styles.searchIcon} />
                <input
                    autoFocus
                    className={styles.searchInputCombo}
                    placeholder={searchMode === "vin" ? "Enter full VIN…" : "Search make, model…"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
            </div>
            <div className={styles.searchComboActions}>
                <button className={styles.btn} onClick={handleSearchSubmit}>
                    <BiSearch /> Search
                </button>
                {activeSearch && (
                    <button className={styles.btn} onClick={handleClearSearch}>
                        <BiX /> Clear
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <SpreadsheetTable<Car>
            columns={CAR_COLUMNS}
            data={cars}
            getRowId={(c) => c.vin}
            page={vinResult !== null ? 1 : page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            refreshing={refreshing}
            isAdmin={isAdmin}
            selected={selected}
            onSelectionChange={setSelected}
            onBulkDelete={handleBulkDelete}
            bulkDeleting={bulkDeleting}
            onEdit={handleEdit}
            onDeleteOne={handleDeleteOne}
            onRefresh={handleRefresh}
            title="Car Database"
            subtitle={activeSearch ? (searchMode === "vin" ? `VIN lookup: ${activeSearch}` : `Search: "${activeSearch}"`) : undefined}
            searchQuery={query}
            onSearchChange={setQuery}
            searchContent={searchBar}
            emptyMessage={searchMode === "vin" && activeSearch ? "No vehicle found with that VIN." : "No vehicles found."}
            onSaveEdits={handleSaveEdits}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={handleSortChange}
        />
    );
};

export default InventoryPanel;
