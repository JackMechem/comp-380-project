"use client";

import { useUserDashboardStore, UserDashboardView } from "@/stores/userDashboardStore";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import {
    BiCalendar, BiUser, BiChevronLeft, BiChevronRight, BiChevronDown,
    BiLogOut, BiCar, BiPlus, BiEdit, BiTable, BiGridAlt, BiShieldQuarter,
} from "react-icons/bi";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "../../components/menus/adminSidebar.module.css";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    view: UserDashboardView;
}

interface NavSection {
    id: string;
    icon: React.ReactNode;
    label: string;
    items: NavItem[];
}

const CUSTOMER_ITEMS: NavItem[] = [
    { icon: <BiCalendar />, label: "Reservations",  view: "reservations"  },
    { icon: <BiUser />,     label: "My Profile",    view: "user-details"  },
];

const ADMIN_SECTIONS: NavSection[] = [
    {
        id: "cars",
        icon: <BiCar />,
        label: "Cars",
        items: [
            { icon: <BiPlus />,  label: "Add Car",   view: "add-car"   },
            { icon: <BiEdit />,  label: "Edit Car",  view: "edit-car"  },
            { icon: <BiTable />, label: "View Data", view: "view-data" },
        ],
    },
    {
        id: "mgmt-reservations",
        icon: <BiCalendar />,
        label: "All Reservations",
        items: [
            { icon: <BiTable />, label: "View Data", view: "view-reservations" },
        ],
    },
    {
        id: "users",
        icon: <BiUser />,
        label: "Users",
        items: [
            { icon: <BiTable />, label: "View Accounts", view: "view-accounts" },
            { icon: <BiUser />,  label: "View Users",    view: "view-users"    },
        ],
    },
];

const ADMIN_VIEWS = new Set<UserDashboardView>([
    "admin-dashboard", "add-car", "edit-car", "view-data",
    "view-reservations", "view-accounts", "view-users",
]);

const DesktopSidebar = () => {
    const { collapsed, toggle, activeView, setActiveView, userEmail, stripeUserId, role, clearSession } = useUserDashboardStore();
    const isPrivileged = role === "ADMIN" || role === "STAFF";
    const hasUser = !!stripeUserId;

    const [openSection, setOpenSection] = useState<string | null>(
        () => ADMIN_SECTIONS.find((s) => s.items.some((i) => i.view === activeView))?.id ?? null
    );
    const [flyout, setFlyout] = useState<string | null>(null);
    const flyoutTimer = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const sectionId = ADMIN_SECTIONS.find((s) => s.items.some((i) => i.view === activeView))?.id;
        if (sectionId) setOpenSection(sectionId);
    }, [activeView]);

    const handleSection = (id: string) => setOpenSection((prev) => (prev === id ? null : id));

    const openFlyout = (id: string) => {
        if (flyoutTimer[0]) clearTimeout(flyoutTimer[0]);
        setFlyout(id);
    };
    const closeFlyout = () => {
        flyoutTimer[0] = setTimeout(() => setFlyout(null), 120);
    };
    const keepFlyout = () => {
        if (flyoutTimer[0]) clearTimeout(flyoutTimer[0]);
    };

    const flyoutSection = ADMIN_SECTIONS.find((s) => s.id === flyout);

    const handleSignOut = () => {
        Cookies.remove("user-session", { path: "/" });
        Cookies.remove("account-id", { path: "/" });
        Cookies.remove("stripe-user-id", { path: "/" });
        Cookies.remove("user-role", { path: "/" });
        clearSession();
    };

    return (
        <div className={`${styles.desktop} ${collapsed ? styles.desktopCollapsed : styles.desktopExpanded}`}>
            {collapsed ? (
                <div className={styles.collapsedStack}>
                    {hasUser && CUSTOMER_ITEMS.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => setActiveView(item.view)}
                            title={item.label}
                            className={`${styles.collapsedIconBtn} ${activeView === item.view ? styles.collapsedIconBtnActive : ""}`}
                        >
                            <span className={styles.collapsedBtnIcon}>{item.icon}</span>
                        </button>
                    ))}
                    {isPrivileged && (
                        <>
                            {hasUser && <div style={{ width: "60%", height: 1, backgroundColor: "var(--color-third)", margin: "4px auto" }} />}
                            <button
                                onClick={() => setActiveView("admin-dashboard")}
                                title={role === "ADMIN" ? "Admin" : "Staff"}
                                className={`${styles.collapsedIconBtn} ${activeView === "admin-dashboard" ? styles.collapsedIconBtnActive : ""}`}
                            >
                                <span className={styles.collapsedBtnIcon}><BiShieldQuarter /></span>
                            </button>
                            {ADMIN_SECTIONS.map((s) => {
                                const sectionActive = s.items.some((i) => i.view === activeView);
                                return (
                                    <div key={s.id} className={styles.collapsedIconWrap}
                                        onMouseEnter={() => openFlyout(s.id)}
                                        onMouseLeave={closeFlyout}
                                    >
                                        <button
                                            className={`${styles.collapsedIconBtn} ${sectionActive ? styles.collapsedIconBtnActive : ""}`}
                                        >
                                            <span className={styles.collapsedBtnIcon}>{s.icon}</span>
                                        </button>

                                        {flyout === s.id && flyoutSection && (
                                            <div
                                                className={styles.flyout}
                                                onMouseEnter={keepFlyout}
                                                onMouseLeave={closeFlyout}
                                            >
                                                <p className={styles.flyoutLabel}>{flyoutSection.label}</p>
                                                {flyoutSection.items.map((item) => {
                                                    const isActive = activeView === item.view;
                                                    return (
                                                        <button
                                                            key={item.view}
                                                            onClick={() => { setActiveView(item.view); setFlyout(null); }}
                                                            className={`${styles.flyoutItem} ${isActive ? styles.flyoutItemActive : ""}`}
                                                        >
                                                            <span className={`${styles.flyoutItemIcon} ${isActive ? styles.flyoutItemIconActive : ""}`}>
                                                                {item.icon}
                                                            </span>
                                                            <span className={styles.flyoutItemLabel}>{item.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.expandedInner}>
                    {/* Identity header */}
                    <div className={styles.navTop} style={{ borderBottom: "1px solid var(--color-third)", paddingBottom: 12, marginBottom: 0 }}>
                        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-foreground-light)", marginBottom: 4, padding: "0 4px" }}>
                            Signed in as
                        </p>
                        <p style={{ fontSize: 12, color: "var(--color-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 4px" }}>
                            {userEmail ?? "—"}
                        </p>
                    </div>

                    <div className={styles.navSections}>
                        {/* Customer nav items */}
                        {hasUser && (
                            <>
                                <div style={{ paddingTop: 8 }}>
                                    <p style={{
                                        fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                                        letterSpacing: "0.06em", padding: "0 4px", marginBottom: 2,
                                        color: "var(--color-foreground-light)",
                                    }}>
                                        Personal
                                    </p>
                                </div>
                                {CUSTOMER_ITEMS.map((item) => (
                                    <button
                                        key={item.view}
                                        onClick={() => setActiveView(item.view)}
                                        className={`${styles.dashBtn} ${activeView === item.view ? styles.dashBtnActive : ""}`}
                                    >
                                        <span className={styles.dashBtnIcon}>{item.icon}</span>
                                        <span className={styles.dashBtnLabel}>{item.label}</span>
                                    </button>
                                ))}
                            </>
                        )}

                    {/* Admin/Staff sections */}
                    {isPrivileged && (
                        <>
                            <div style={{ padding: "6px 0 0" }}>
                                <p style={{
                                    fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                                    letterSpacing: "0.06em", padding: "0 4px", marginBottom: 2,
                                    color: "var(--color-foreground-light)",
                                }}>
                                    {role === "ADMIN" ? "Admin" : "Staff"}
                                </p>
                            </div>
                                <button
                                    onClick={() => setActiveView("admin-dashboard")}
                                    className={`${styles.dashBtn} ${activeView === "admin-dashboard" ? styles.dashBtnActive : ""}`}
                                >
                                    <BiGridAlt className={styles.dashBtnIcon} />
                                    <span className={styles.dashBtnLabel}>Overview</span>
                                </button>

                                {ADMIN_SECTIONS.map((s) => {
                                    const isOpen = openSection === s.id;
                                    const hasActive = s.items.some((i) => i.view === activeView);
                                    return (
                                        <div key={s.id} className={`${styles.navSection} ${isOpen ? styles.navSectionOpen : ""}`}>
                                            <button
                                                onClick={() => handleSection(s.id)}
                                                className={`${styles.sectionBtn} ${isOpen || hasActive ? styles.sectionBtnOpen : ""}`}
                                            >
                                                <span className={styles.sectionBtnIcon}>{s.icon}</span>
                                                <span className={styles.sectionBtnLabel}>{s.label}</span>
                                                <BiChevronDown className={`${styles.sectionChevron} ${isOpen ? styles.sectionChevronOpen : ""}`} />
                                            </button>
                                            {isOpen && (
                                                <div className={styles.subItems}>
                                                    {s.items.map((item) => {
                                                        const isActive = activeView === item.view;
                                                        return (
                                                            <button
                                                                key={item.view}
                                                                onClick={() => setActiveView(item.view)}
                                                                className={`${styles.subItem} ${isActive ? styles.subItemActive : ""}`}
                                                            >
                                                                <span className={`${styles.subItemIcon} ${isActive ? styles.subItemIconActive : ""}`}>
                                                                    {item.icon}
                                                                </span>
                                                                <span className={styles.subItemLabel}>{item.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </>
                    )}
                    </div>

                    {/* Sign out */}
                    <div style={{ padding: "0 10px 12px", marginTop: "auto" }}>
                        <div className={styles.navDivider} style={{ marginBottom: 8 }} />
                        <button onClick={handleSignOut} className={styles.dashBtn}>
                            <BiLogOut className={styles.dashBtnIcon} />
                            <span className={styles.dashBtnLabel}>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
            <button onClick={toggle} className={styles.toggleBtn}>
                {collapsed
                    ? <BiChevronRight className={styles.toggleBtnIcon} />
                    : <BiChevronLeft className={styles.toggleBtnIcon} />}
            </button>
        </div>
    );
};

const MobileSidebar = () => {
    const { activeView, setActiveView, stripeUserId, role } = useUserDashboardStore();
    const isPrivileged = role === "ADMIN" || role === "STAFF";
    const hasUser = !!stripeUserId;
    const [sheetSection, setSheetSection] = useState<string | null>(null);

    const closeSheet = () => setSheetSection(null);
    const sheet = ADMIN_SECTIONS.find((s) => s.id === sheetSection);

    return (
        <>
            <div className={styles.mobileBar}>
                {hasUser && CUSTOMER_ITEMS.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => { setActiveView(item.view); closeSheet(); }}
                        className={`${styles.mobileTabBtn} ${activeView === item.view ? styles.mobileTabBtnActive : ""}`}
                    >
                        <span className={styles.mobileTabIcon}>{item.icon}</span>
                        <span className={styles.mobileTabLabel}>{item.label}</span>
                    </button>
                ))}
                {isPrivileged && (
                    <>
                        <button
                            onClick={() => { setActiveView("admin-dashboard"); closeSheet(); }}
                            className={`${styles.mobileTabBtn} ${activeView === "admin-dashboard" ? styles.mobileTabBtnActive : ""}`}
                        >
                            <span className={styles.mobileTabIcon}><BiGridAlt /></span>
                            <span className={styles.mobileTabLabel}>Overview</span>
                        </button>
                        {ADMIN_SECTIONS.map((s) => {
                            const sectionActive = s.items.some((i) => i.view === activeView) || sheetSection === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setSheetSection(s.id)}
                                    className={`${styles.mobileTabBtn} ${sectionActive ? styles.mobileTabBtnActive : ""}`}
                                >
                                    <span className={styles.mobileTabIcon}>{s.icon}</span>
                                    <span className={styles.mobileTabLabel}>{s.label}</span>
                                </button>
                            );
                        })}
                    </>
                )}
            </div>

            {sheet && (
                <>
                    <div className={styles.overlay} onClick={closeSheet} />
                    <div className={styles.sheet}>
                        <div className={styles.sheetHeader}>
                            <div className={styles.sheetTitleGroup}>
                                <span className={styles.sheetTitleIcon}>{sheet.icon}</span>
                                <span className={styles.sheetTitle}>{sheet.label}</span>
                            </div>
                            <button onClick={closeSheet} className={styles.sheetCloseBtn}>
                                <BiLogOut />
                            </button>
                        </div>
                        <div className={styles.sheetItems}>
                            {sheet.items.map((item) => {
                                const isActive = activeView === item.view;
                                return (
                                    <button
                                        key={item.view}
                                        onClick={() => { setActiveView(item.view); closeSheet(); }}
                                        className={`${styles.sheetItem} ${isActive ? styles.sheetItemActive : ""}`}
                                    >
                                        <span className={`${styles.sheetItemIcon} ${isActive ? styles.sheetItemIconActive : ""}`}>
                                            {item.icon}
                                        </span>
                                        <span className={styles.sheetItemLabel}>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className={styles.sheetSpacer} />
                    </div>
                </>
            )}
        </>
    );
};

const UserSidebar = () => {
    const { width } = useWindowSize();
    if (width === undefined) return null;
    return width < 768 ? <MobileSidebar /> : <DesktopSidebar />;
};

export default UserSidebar;
