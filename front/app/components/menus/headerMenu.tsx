"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import DefaultProfilePhoto from "../defaultProfilePhoto";
import Image from "next/image";
import { BiTrash, BiCog } from "react-icons/bi";
import { CartProps } from "@/app/types/CartTypes";
import { BsCart2, BsCart3 } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import ThemeToggle from "../ThemeToggle";
import styles from "./headerMenu.module.css";

const HeaderMenu = () => {
    const { openPanel, close } = useSidebarStore();
    const isOpen = openPanel === "menu";
    const {
        carData,
        removeCar,
    }: { carData: CartProps[]; removeCar: (vin: string) => void } =
        useCartStore();
    const cartCount = carData.length;

    const { isAuthenticated, sessionToken, userEmail, userName, accountId, role, clearSession, setUserEmail, setUserName } = useUserDashboardStore();

    const isLoggedIn = isAuthenticated && !!sessionToken;
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

    const handleSignOut = () => {
        Cookies.remove("user-session", { path: "/" });
        Cookies.remove("account-id", { path: "/" });
        Cookies.remove("stripe-user-id", { path: "/" });
        Cookies.remove("user-role", { path: "/" });
        clearSession();
        close();
    };

    // Derive display info for the profile row
    const displayName = isLoggedIn ? (userName ?? userEmail ?? "User") : null;
    const displayRole = isAdmin
        ? (role === "ADMIN" ? "Administrator" : "Staff")
        : isGuest
            ? "Guest"
            : isLoggedIn
                ? (role ?? "User")
                : "Not signed in";

    return (
        <>
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
                {/* Header */}
                <div className={styles.headerRow}>
                    <button onClick={close} className={styles.closeBtn}>
                        <IoClose />
                    </button>
                    <p className={styles.menuTitle}>Menu</p>
                    <ThemeToggle />
                </div>

                {/* Profile section */}
                <div className={styles.profileRow}>
                    <div className={styles.avatarBorder}>
                        <DefaultProfilePhoto totalHeight={48} headSize={16} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p className={styles.profileName}>
                            {displayName ?? "Not signed in"}
                        </p>
                        <p className={styles.profileRole}>{displayRole}</p>
                    </div>
                    {isLoggedIn ? (
                        <div className={styles.profileActions}>
                            <Link href="/dashboard" onClick={close} className={styles.gearBtn} title="Dashboard">
                                <BiCog />
                            </Link>
                            <button onClick={handleSignOut} className={styles.signOutBtn}>
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authBtns}>
                            <Link href="/login" onClick={close} className={styles.loginBtn}>
                                Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Cart section */}
                <div className={styles.cartSection}>
                    <div className={styles.cartHeader}>
                        <BsCart2 className={styles.cartIcon} />
                        <p className={styles.cartTitle}>Cart</p>
                        {cartCount > 0 && (
                            <span className={styles.cartCount}>
                                {cartCount} {cartCount === 1 ? "car" : "cars"}
                            </span>
                        )}
                    </div>

                    {cartCount === 0 ? (
                        <div className={styles.emptyCart}>
                            <BsCart3 className={styles.emptyCartIcon} />
                            <p className={styles.emptyCartText}>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className={styles.cartItems}>
                            {carData.map((car: CartProps) => (
                                <div key={car.vin} className={`card ${styles.cartItem}`}>
                                    {car.image && (
                                        <Image
                                            src={car.image}
                                            alt="Car Photo"
                                            width={124}
                                            height={124}
                                            className={styles.cartItemImage}
                                        />
                                    )}
                                    <div className={styles.cartItemBody}>
                                        <div>
                                            <p className={styles.cartItemName}>
                                                {car.make} {car.model}
                                            </p>
                                            {car.startDate && car.endDate && (
                                                <p className={styles.cartItemDates}>
                                                    {new Date(car.startDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                    {" – "}
                                                    {new Date(car.endDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        <p className={styles.cartItemPrice}>
                                            ${car.pricePerDay}
                                            <span className={styles.cartItemPriceUnit}>/day</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeCar(car.vin)}
                                        className={styles.cartItemRemove}
                                    >
                                        <BiTrash className={styles.cartItemRemoveIcon} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    {cartCount > 0 && (
                        <Link href="/checkout" onClick={close} className={styles.checkoutBtn}>
                            Checkout
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default HeaderMenu;
