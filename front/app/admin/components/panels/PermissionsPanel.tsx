"use client";

import { useEffect, useState } from "react";
import { useTableConfigStore, RolePerms } from "@/app/admin/config/tableConfigStore";
import { BiRefresh, BiLock, BiLockOpen } from "react-icons/bi";

// ── Static metadata ───────────────────────────────────────────────────────────

const TABLE_KEYS = ["cars", "accounts", "users", "reservations", "reviews"] as const;
type TableKey = typeof TABLE_KEYS[number];

const TABLE_LABELS: Record<TableKey, string> = {
    cars: "Cars",
    accounts: "Accounts",
    users: "Users",
    reservations: "Reservations",
    reviews: "Reviews",
};

const TABLE_COLUMNS: Record<TableKey, string[]> = {
    cars: ["vin", "make", "model", "modelYear", "vehicleClass", "carStatus", "pricePerDay", "bodyType", "transmission", "drivetrain", "engineLayout", "fuel", "roofType", "cylinders", "gears", "horsepower", "torque", "seats", "mpg", "features", "images", "description"],
    accounts: ["acctId", "name", "email", "role", "dateCreated", "dateEmailConfirmed", "user", "bookmarkedCars"],
    users: ["userId", "firstName", "lastName", "email", "phoneNumber", "dateCreated", "address", "dlNumber", "dlState", "dlExpires", "dob", "reservations", "reviews"],
    reservations: ["reservationId", "car", "userId", "pickUpTime", "dropOffTime", "durationDays", "dateBooked", "payments"],
    reviews: ["reviewId", "account", "car", "stars", "title", "bodyOfText", "rentalDuration", "publishedDate"],
};

// ── Toggle switch ─────────────────────────────────────────────────────────────

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
        onClick={() => onChange(!value)}
        style={{
            width: 36, height: 20, borderRadius: 10,
            background: value ? "var(--color-accent)" : "var(--color-third)",
            border: "none", cursor: "pointer", position: "relative",
            transition: "background 150ms", flexShrink: 0,
        }}
    >
        <span style={{
            position: "absolute", top: 2,
            left: value ? 18 : 2,
            width: 16, height: 16, borderRadius: "50%",
            background: "#fff",
            transition: "left 150ms",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
    </button>
);

// ── Column picker ─────────────────────────────────────────────────────────────

const ColPicker = ({
    label, icon, cols, selected: selectedRaw, onChange,
}: {
    label: string;
    icon: React.ReactNode;
    cols: string[];
    selected: string[] | null | undefined;
    onChange: (next: string[]) => void;
}) => {
    const selected = selectedRaw ?? [];
    const [open, setOpen] = useState(false);
    const toggle = (col: string) => {
        if (selected.includes(col)) onChange(selected.filter((c) => c !== col));
        else onChange([...selected, col]);
    };
    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "none", border: "1px solid var(--color-third)",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    color: "var(--color-foreground-light)", fontSize: 11,
                    transition: "border-color 150ms, color 150ms",
                }}
            >
                {icon}
                {label}
                {selected.length > 0 && (
                    <span style={{
                        background: "var(--color-accent)", color: "#fff",
                        borderRadius: "999px", fontSize: 9, fontWeight: 700,
                        padding: "1px 6px", marginLeft: 2,
                    }}>
                        {selected.length}
                    </span>
                )}
            </button>
            {open && (
                <div style={{
                    marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4,
                    padding: "8px 10px",
                    background: "var(--color-primary-dark, var(--color-third))",
                    borderRadius: 8, border: "1px solid var(--color-third)",
                }}>
                    {cols.map((col) => {
                        const checked = selected.includes(col);
                        return (
                            <button
                                key={col}
                                onClick={() => toggle(col)}
                                style={{
                                    padding: "3px 9px", borderRadius: 6, fontSize: 11,
                                    border: `1px solid ${checked ? "var(--color-accent)" : "var(--color-third)"}`,
                                    background: checked ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "none",
                                    color: checked ? "var(--color-accent)" : "var(--color-foreground-light)",
                                    cursor: "pointer", transition: "all 120ms",
                                }}
                            >
                                {col}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Role row ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
    admin: { bg: "rgba(239,68,68,0.10)", color: "#ef4444" },
    staff: { bg: "rgba(59,130,246,0.10)", color: "#3b82f6" },
};

interface RoleRowProps {
    table: TableKey;
    roleKey: "admin" | "staff";
    perms: RolePerms;
    saving: boolean;
    onUpdate: (patch: Partial<RolePerms>) => void;
}

const RoleRow = ({ table, roleKey, perms, saving, onUpdate }: RoleRowProps) => {
    const cols = TABLE_COLUMNS[table];
    const { bg, color } = ROLE_COLORS[roleKey];
    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: "12px 16px",
            borderTop: "1px solid color-mix(in srgb, var(--color-third) 60%, transparent)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {/* Role badge */}
                <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 6,
                    background: bg, color, flexShrink: 0, width: 52, textAlign: "center",
                }}>
                    {roleKey}
                </span>

                {/* Bool toggles */}
                {(["canEdit", "canDelete", "canAddRow"] as const).map((key) => (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, cursor: saving ? "not-allowed" : "pointer" }}>
                        <Toggle value={perms[key]} onChange={(v) => !saving && onUpdate({ [key]: v })} />
                        <span style={{ fontSize: 12, color: "var(--color-foreground-light)" }}>
                            {key === "canEdit" ? "Edit" : key === "canDelete" ? "Delete" : "Add Row"}
                        </span>
                    </label>
                ))}
            </div>

            {/* Column pickers */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <ColPicker
                    label="Locked Cols"
                    icon={<BiLockOpen style={{ fontSize: 12 }} />}
                    cols={cols}
                    selected={perms.lockedCols ?? []}
                    onChange={(v) => !saving && onUpdate({ lockedCols: v })}
                />
                <ColPicker
                    label="Perm. Locked"
                    icon={<BiLock style={{ fontSize: 12 }} />}
                    cols={cols}
                    selected={perms.permanentlyLockedCols ?? []}
                    onChange={(v) => !saving && onUpdate({ permanentlyLockedCols: v })}
                />
            </div>
        </div>
    );
};

// ── Table card ────────────────────────────────────────────────────────────────

const TableCard = ({ tableKey }: { tableKey: TableKey }) => {
    const { config, updateTable, saving } = useTableConfigStore();
    const entry = config[tableKey];
    const isSaving = saving === tableKey;

    const handleUpdate = async (roleKey: "admin" | "staff", patch: Partial<RolePerms>) => {
        await updateTable(tableKey, { [roleKey]: patch });
    };

    if (!entry) return null;

    return (
        <div style={{
            borderRadius: 10, border: "1px solid var(--color-third)",
            background: "var(--color-primary)", overflow: "hidden",
        }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px",
                background: "color-mix(in srgb, var(--color-third) 30%, transparent)",
            }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--color-foreground)" }}>
                    {TABLE_LABELS[tableKey]}
                </span>
                {isSaving && (
                    <span style={{ fontSize: 11, color: "var(--color-foreground-light)" }}>Saving…</span>
                )}
            </div>
            <RoleRow table={tableKey} roleKey="admin" perms={entry.admin} saving={isSaving} onUpdate={(p) => handleUpdate("admin", p)} />
            <RoleRow table={tableKey} roleKey="staff" perms={entry.staff} saving={isSaving} onUpdate={(p) => handleUpdate("staff", p)} />
        </div>
    );
};

// ── Panel ─────────────────────────────────────────────────────────────────────

const PermissionsPanel = () => {
    const { fetchConfig, loading } = useTableConfigStore();

    useEffect(() => { fetchConfig(); }, []);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Table Permissions</h1>
                <button
                    onClick={fetchConfig}
                    disabled={loading}
                    title="Refresh from server"
                    style={{
                        background: "none", border: "none", cursor: loading ? "not-allowed" : "pointer",
                        color: "var(--color-foreground-light)", fontSize: 16, display: "flex", alignItems: "center",
                        opacity: loading ? 0.5 : 1,
                    }}
                >
                    <BiRefresh style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                </button>
            </div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
                Changes are saved immediately. Toggle permissions per role, and select which columns are locked or permanently locked.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {TABLE_KEYS.map((k) => <TableCard key={k} tableKey={k} />)}
            </div>
        </div>
    );
};

export default PermissionsPanel;
