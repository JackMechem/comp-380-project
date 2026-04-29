"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCartStore } from "@/stores/cartStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { useBookmarkStore, BookmarkCar, removeBookmark as removeBookmarkApi, clearBookmarks as clearBookmarksApi } from "@/stores/bookmarkStore";
import { useBookmarkSync } from "@/app/hooks/useBookmarkSync";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import Image from "next/image";
import { BiTrash, BiUser, BiGitCompare, BiTerminal, BiPlus, BiCheck, BiChevronDown, BiChevronUp, BiLogOut, BiDotsVerticalRounded } from "react-icons/bi";
import { CartProps } from "@/app/types/CartTypes";
import { BsCart2, BsCart3, BsBookmark, BsPeopleFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import ThemeToggle from "../ThemeToggle";
import styles from "./headerMenu.module.css";
import { MdSpaceDashboard } from "react-icons/md";

const ROLE_COLOR: Record<string, string> = {
    ADMIN: "var(--color-accent)",
    STAFF: "var(--color-accent)",
};

const HeaderMenu = () => {
    const { openPanel, close, openDevConsole } = useSidebarStore();
    const isOpen = openPanel === "menu";
    const router = useRouter();
    const { carData, removeCar }: { carData: CartProps[]; removeCar: (vin: string) => void } = useCartStore();
    const cartCount = carData.length;

    const { isAuthenticated, sessionToken, userEmail, userName, accountId, role, clearSession, clearAllSessions, setUserEmail, setUserName, sessions, activeSessionIndex, switchSession, removeSession } = useUserDashboardStore();
    const bookmarks = useBookmarkStore((s) => s.bookmarks);
    const bookmarkCount = bookmarks.length;

    useBookmarkSync();

    const isLoggedIn = isAuthenticated && !!sessionToken;

    const ctxItemStyle: React.CSSProperties = {
        display: "flex", alignItems: "center", gap: 8,
        width: "calc(100% - 8px)", margin: "0 4px",
        padding: "6px 10px", fontSize: "9.5pt",
        color: "var(--color-foreground)", background: "transparent",
        border: "none", borderRadius: 6,
        cursor: "pointer", textAlign: "left", boxSizing: "border-box",
    };
    const isGuest = isLoggedIn && role === "GUEST";
    const isAdmin = isLoggedIn && (role === "ADMIN" || role === "STAFF");

    useEffect(() => {
        if (isLoggedIn && !userEmail && accountId) {
            fetch(`/api/accounts/${accountId}`)
                .then((r) => r.json())
                .then((a) => {
                    if (a?.email) setUserEmail(a.email);
                    if (a?.name) setUserName(a.name);
                })
                .catch(() => {});
        }
    }, [isLoggedIn, accountId]);

    const applySessionCookies = (token: string, accountId: number, role: string, expiresAt: string, stripeUserId?: number | null) => {
        const exp = new Date(expiresAt);
        Cookies.set("user-session", token, { path: "/", expires: exp });
        Cookies.set("account-id", String(accountId), { path: "/", expires: exp });
        Cookies.set("user-role", role, { path: "/", expires: exp });
        if (stripeUserId != null) {
            Cookies.set("stripe-user-id", String(stripeUserId), { path: "/", expires: exp });
        } else {
            Cookies.remove("stripe-user-id", { path: "/" });
        }
    };

    const handleSignOut = () => {
        Cookies.remove("user-session", { path: "/" });
        Cookies.remove("account-id", { path: "/" });
        Cookies.remove("stripe-user-id", { path: "/" });
        Cookies.remove("user-role", { path: "/" });
        useBookmarkStore.getState().setBookmarks([]);
        clearSession();
        close();
    };

    const handleAddAccount = () => {
        sessionStorage.setItem("add-account", "1");
        close();
        router.push("/login");
    };

    const [cartOpen, setCartOpen] = useState(true);
    const [bookmarksOpen, setBookmarksOpen] = useState(true);

    // Dots context menu (replaces old acctMenu popup)
    const [dotMenuOpen, setDotMenuOpen] = useState(false);
    const [dotMenuView, setDotMenuView] = useState<"main" | "accounts">("main");
    const dotBtnRef = useRef<HTMLButtonElement>(null);
    const dotMenuRef = useRef<HTMLDivElement>(null);
    const [dotMenuPos, setDotMenuPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!dotMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (dotMenuRef.current?.contains(e.target as Node) || dotBtnRef.current?.contains(e.target as Node)) return;
            setDotMenuOpen(false);
            setDotMenuView("main");
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [dotMenuOpen]);

    const openDotMenu = () => {
        if (!dotBtnRef.current) return;
        const rect = dotBtnRef.current.getBoundingClientRect();
        setDotMenuPos({ top: rect.bottom + 4, left: rect.right });
        setDotMenuView("main");
        setDotMenuOpen(v => !v);
    };


    const displayName = isLoggedIn ? (userName ?? userEmail ?? "User") : null;
    const displayRole = isAdmin
        ? (role === "ADMIN" ? "Administrator" : "Staff")
        : isGuest ? "Guest"
        : isLoggedIn ? (role ?? "User")
        : "Not signed in";

    return (
        <>
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
                {/* Header */}
                <div className={styles.headerRow}>
                    <button onClick={close} className={styles.closeBtn}><IoClose /></button>
                    <p className={styles.menuTitle}>Menu</p>
                    <ThemeToggle />
                </div>

                {/* Profile section */}
                <div className={styles.profileRow}>
                    <div className={styles.avatarBorder} style={isAdmin ? { borderColor: "color-mix(in srgb, var(--color-accent) 40%, transparent)" } : undefined}>
                        {role === "ADMIN" ? (
                            <div className={styles.roleAvatar} style={{ background: "var(--color-accent)" }}>
                                <BiUser style={{ fontSize: 22, color: "#fff" }} />
                            </div>
                        ) : role === "STAFF" ? (
                            <div className={styles.roleAvatar} style={{ background: "var(--color-accent)" }}>
                                <BiUser style={{ fontSize: 22, color: "#fff" }} />
                            </div>
                        ) : (
                            <DefaultProfilePhoto totalHeight={48} headSize={16} />
                        )}
                    </div>
                    <div className={styles.profileInfo}>
                        <p className={styles.profileName}>{displayName ?? "Not signed in"}</p>
                        <p className={styles.profileRole}>{displayRole}</p>
                        {!isLoggedIn && (
                            <div className={styles.authBtns}>
                                <Link href="/login" onClick={close} className={styles.loginBtn}>Login</Link>
                            </div>
                        )}
                    </div>
                    {isLoggedIn && (
                        <button ref={dotBtnRef} onClick={openDotMenu} className={`${styles.gearBtn} ${dotMenuOpen ? styles.gearBtnActive : ""}`} title="More options">
                            <BiDotsVerticalRounded />
                        </button>
                    )}
                </div>
                {isLoggedIn && (
                    <div className={styles.menuActions}>
                        <Link href="/dashboard" onClick={close} className={styles.menuActionBtn}>
                            <div className={styles.menuActionIcon}>
                                <MdSpaceDashboard />
                            </div>
                            <div className={styles.menuActionText}>
                                <span className={styles.menuActionTitle}>Dashboard</span>
                                <span className={styles.menuActionSub}>Manage your reservations & account</span>
                            </div>
                        </Link>
                        {role === "ADMIN" && (
                            <button onClick={() => { close(); setTimeout(openDevConsole, 50); }} className={styles.menuActionBtn}>
                                <div className={styles.menuActionIcon}>
                                    <BiTerminal />
                                </div>
                                <div className={styles.menuActionText}>
                                    <span className={styles.menuActionTitle}>Dev Console</span>
                                    <span className={styles.menuActionSub}>Admin tools & debug panel</span>
                                </div>
                            </button>
                        )}
                    </div>
                )}

                {/* Dots context menu */}
                {dotMenuOpen && typeof document !== "undefined" && createPortal(
                    <div
                        ref={dotMenuRef}
                        style={{
                            position: "fixed",
                            top: dotMenuPos.top,
                            left: dotMenuPos.left,
                            transform: "translateX(-100%)",
                            zIndex: 9999,
                            background: "var(--color-primary)",
                            border: "1px solid var(--color-third)",
                            borderRadius: 10,
                            padding: "4px 0",
                            minWidth: 200,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        {dotMenuView === "main" ? (
                            <>
                                {isAdmin && (
                                    <button
                                        onClick={() => setDotMenuView("accounts")}
                                        style={{ ...ctxItemStyle, justifyContent: "space-between" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><BsPeopleFill size={13} /> Switch Account</span>
                                        <BiChevronDown size={13} style={{ transform: "rotate(-90deg)" }} />
                                    </button>
                                )}
                                <button
                                    onClick={() => { setDotMenuOpen(false); handleSignOut(); }}
                                    style={{ ...ctxItemStyle, color: "#ef4444" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    <BiLogOut size={13} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setDotMenuView("main")}
                                    style={{ ...ctxItemStyle, color: "var(--color-foreground-light)", fontSize: "8.5pt" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    <BiChevronDown size={13} style={{ transform: "rotate(90deg)" }} /> Back
                                </button>
                                <div style={{ height: 1, background: "var(--color-third)", margin: "4px 0" }} />
                                {sessions.map((s, i) => {
                                    const active = i === activeSessionIndex;
                                    const color = ROLE_COLOR[s.role] ?? "var(--color-foreground-light)";
                                    const label = s.userName || s.userEmail || `#${s.accountId}`;
                                    return (
                                        <div
                                            key={s.accountId}
                                            style={{ ...ctxItemStyle, display: "flex", cursor: active ? "default" : "pointer", opacity: active ? 1 : 0.85 }}
                                            onClick={() => {
                                                if (!active) {
                                                    switchSession(i);
                                                    applySessionCookies(s.token, s.accountId, s.role, s.sessionExpiresAt, s.stripeUserId);
                                                    setDotMenuOpen(false);
                                                }
                                            }}
                                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                        >
                                            <div className={styles.acctMenuAvatar} style={{ background: color }}>
                                                <BiUser style={{ color: "#fff", fontSize: 11 }} />
                                            </div>
                                            <div className={styles.acctMenuInfo} style={{ flex: 1, minWidth: 0 }}>
                                                <div className={styles.acctMenuName}>{label}</div>
                                                <div className={styles.acctMenuRole} style={{ color }}>{s.role}</div>
                                            </div>
                                            {active && <BiCheck style={{ color, fontSize: 16, flexShrink: 0 }} />}
                                            {!active && (
                                                <button className={styles.acctMenuRemove} onClick={(e) => { e.stopPropagation(); removeSession(i); }} title="Remove">
                                                    <IoClose />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <div style={{ height: 1, background: "var(--color-third)", margin: "4px 0" }} />
                                <button
                                    onClick={() => { handleAddAccount(); setDotMenuOpen(false); }}
                                    style={ctxItemStyle}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    <BiPlus size={13} /> Add account
                                </button>
                                {sessions.length > 1 && (
                                    <button
                                        onClick={() => { clearAllSessions(); setDotMenuOpen(false); close(); }}
                                        style={{ ...ctxItemStyle, color: "#ef4444" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <IoClose size={13} /> Sign out all
                                    </button>
                                )}
                            </>
                        )}
                    </div>,
                    document.body
                )}

                {/* Cart section */}
                <div className={`${styles.cartSection} ${styles.cartSectionBorderTop}`}>
                    <button className={styles.cartHeader} onClick={() => setCartOpen(o => !o)}>
                        <BsCart2 className={styles.cartIcon} />
                        <p className={styles.cartTitle}>Cart</p>
                        {cartCount > 0 && <span className={styles.cartCount}>{cartCount} {cartCount === 1 ? "car" : "cars"}</span>}
                        <span className={styles.cartHeaderSpacer} />
                        {cartOpen ? <BiChevronUp className={styles.collapseIcon} /> : <BiChevronDown className={styles.collapseIcon} />}
                    </button>
                    {cartOpen && (cartCount === 0 ? (
                        <div className={styles.emptyCart}>
                            <BsCart3 className={styles.emptyCartIcon} />
                            <p className={styles.emptyCartText}>Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.cartItems}>
                                {carData.map((car: CartProps) => (
                                    <div key={car.vin} className={`card ${styles.cartItem}`}>
                                        {car.image && (
                                            <Image src={car.image} alt="Car Photo" width={124} height={124} className={styles.cartItemImage} />
                                        )}
                                        <div className={styles.cartItemBody}>
                                            <div>
                                                <p className={styles.cartItemName}>{car.make} {car.model}</p>
                                                {car.startDate && car.endDate && (
                                                    <p className={styles.cartItemDates}>
                                                        {new Date(car.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                        {" – "}
                                                        {new Date(car.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </p>
                                                )}
                                            </div>
                                            <p className={styles.cartItemPrice}>
                                                ${car.pricePerDay}
                                                <span className={styles.cartItemPriceUnit}>/day</span>
                                            </p>
                                        </div>
                                        <button onClick={() => removeCar(car.vin)} className={styles.cartItemRemove}>
                                            <BiTrash className={styles.cartItemRemoveIcon} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Link href="/checkout" onClick={close} className={styles.checkoutBtn}>Checkout</Link>
                        </>
                    ))}
                </div>

                {/* Bookmarks section */}
                {isLoggedIn && (
                    <div className={styles.bookmarkSection}>
                        <div className={styles.cartHeader}>
                            <button className={styles.cartHeaderBtn} onClick={() => setBookmarksOpen(o => !o)}>
                                <BsBookmark className={styles.cartIcon} />
                                <p className={styles.cartTitle}>Bookmarks</p>
                                <span className={styles.cartHeaderSpacer} />
                            </button>
                            {bookmarkCount > 0 && <span className={styles.cartCount}>{bookmarkCount} {bookmarkCount === 1 ? "car" : "cars"}</span>}
                            {bookmarkCount > 0 && (
                                <button onClick={() => { if (accountId) clearBookmarksApi(accountId); }} className={styles.clearBtn}>
                                    Clear
                                </button>
                            )}
                            <button onClick={() => setBookmarksOpen(o => !o)} className={styles.chevronBtn}>
                                {bookmarksOpen ? <BiChevronUp className={styles.collapseIcon} /> : <BiChevronDown className={styles.collapseIcon} />}
                            </button>
                        </div>
                        {bookmarksOpen && (bookmarkCount === 0 ? (
                            <div className={styles.emptyCart}>
                                <BsBookmark className={styles.emptyCartIcon} />
                                <p className={styles.emptyCartText}>No bookmarked cars</p>
                            </div>
                        ) : (
                            <div className={styles.cartItems}>
                                {bookmarks.map((car: BookmarkCar) => (
                                    <Link key={car.vin} href={`/car/${car.vin}`} onClick={close} className={`card ${styles.cartItem}`}>
                                        {car.image && (
                                            <Image src={car.image} alt="Car Photo" width={124} height={124} className={styles.cartItemImage} />
                                        )}
                                        <div className={styles.cartItemBody}>
                                            <p className={styles.cartItemName}>{car.make} {car.model}</p>
                                            <p className={styles.cartItemPrice}>
                                                ${car.pricePerDay}
                                                <span className={styles.cartItemPriceUnit}>/day</span>
                                            </p>
                                        </div>
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (accountId) removeBookmarkApi(accountId, car.vin); }} className={styles.cartItemRemove}>
                                            <BiTrash className={styles.cartItemRemoveIcon} />
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        ))}
                        {bookmarksOpen && bookmarkCount >= 2 && (
                            <Link href="/compare" onClick={close} className={styles.compareBtn}>
                                <BiGitCompare /> Compare all
                            </Link>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className={styles.footer} />
            </div>
        </>
    );
};

export default HeaderMenu;
