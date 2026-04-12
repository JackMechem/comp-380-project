"use client";

import { useState } from "react";
import Image from "next/image";
import NavHeader from "../components/headers/navHeader";
import MainBodyContainer from "../components/containers/mainBodyContainer";
import { useCartStore } from "@/stores/cartStore";
import { CartProps } from "../types/CartTypes";
import { BiCar, BiCalendar, BiTrash, BiCreditCard, BiLock, BiUser, BiPhone, BiEnvelope, BiIdCard } from "react-icons/bi";
import styles from "./checkout.module.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

const daysBetween = (start?: string, end?: string): number => {
    if (!start || !end) return 1;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
};

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

// ── Cart item row ─────────────────────────────────────────────────────────────

const CartItemRow = ({ item, onRemove }: { item: CartProps; onRemove: () => void }) => {
    const days = daysBetween(item.startDate, item.endDate);
    const subtotal = item.pricePerDay * days;

    return (
        <div className={styles.cartItemRow}>
            <div className={styles.cartItemThumb}>
                {item.image ? (
                    <Image src={item.image} alt={`${item.make} ${item.model}`} fill className="object-cover" sizes="100px"
                        onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                    <div className={styles.cartItemNoImage}>
                        <BiCar className={styles.cartItemNoImageIcon} />
                    </div>
                )}
            </div>

            <div className={styles.cartItemDetails}>
                <div className={styles.cartItemTop}>
                    <div>
                        <p className={styles.cartItemName}>{item.make} {item.model}</p>
                        <p className={styles.cartItemVin}>{item.vin}</p>
                    </div>
                    <button onClick={onRemove} className={styles.cartItemRemoveBtn}>
                        <BiTrash />
                    </button>
                </div>

                <div className={styles.cartItemDates}>
                    <BiCalendar className={styles.cartItemDateIcon} />
                    <span>{fmtDate(item.startDate)} — {fmtDate(item.endDate)}</span>
                    <span className={styles.cartItemDotSep}>·</span>
                    <span>{days} day{days !== 1 ? "s" : ""}</span>
                </div>

                <div className={styles.cartItemPriceRow}>
                    <p className={styles.cartItemPriceDay}>${item.pricePerDay}/day</p>
                    <p className={styles.cartItemSubtotal}>${subtotal.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

// ── Section card ──────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
            <span className={styles.sectionCardIcon}>{icon}</span>
            <p className={styles.sectionCardTitle}>{title}</p>
        </div>
        {children}
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{label}</label>
        {children}
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const { carData, removeCar } = useCartStore();

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", license: "",
        cardName: "", cardNumber: "", expiry: "", cvv: "",
    });

    const setField = (key: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const formatCard = (val: string) =>
        val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

    const formatExpiry = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 4);
        return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    };

    const subtotals = carData.map((item) => item.pricePerDay * daysBetween(item.startDate, item.endDate));
    const subtotal = subtotals.reduce((a, b) => a + b, 0);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // placeholder — no action yet
    };

    return (
        <>
            <NavHeader white={false} />
            <div className={styles.pageWrapper}>
                <MainBodyContainer>
                    <div className={styles.inner}>
                        <h1 className={styles.heading}>Checkout</h1>
                        <p className={styles.subheading}>
                            {carData.length} vehicle{carData.length !== 1 ? "s" : ""} in your reservation
                        </p>

                        {carData.length === 0 ? (
                            <div className={styles.emptyState}>
                                <BiCar className={styles.emptyIcon} />
                                <p className={styles.emptyText}>Your cart is empty.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGrid}>

                                    {/* ── Left column ── */}
                                    <div className={styles.leftCol}>

                                        {/* Cart items */}
                                        <SectionCard title="Your Vehicles" icon={<BiCar />}>
                                            <div>
                                                {carData.map((item) => (
                                                    <CartItemRow
                                                        key={item.vin}
                                                        item={item}
                                                        onRemove={() => removeCar(item.vin)}
                                                    />
                                                ))}
                                            </div>
                                        </SectionCard>

                                        {/* Personal details */}
                                        <SectionCard title="Your Details" icon={<BiUser />}>
                                            <div className={styles.inputGrid2}>
                                                <Field label="First Name">
                                                    <input className={styles.input} placeholder="John" value={form.firstName}
                                                        onChange={(e) => setField("firstName", e.target.value)} required />
                                                </Field>
                                                <Field label="Last Name">
                                                    <input className={styles.input} placeholder="Doe" value={form.lastName}
                                                        onChange={(e) => setField("lastName", e.target.value)} required />
                                                </Field>
                                            </div>
                                            <div className={styles.inputGrid2}>
                                                <Field label="Email">
                                                    <div className={styles.inputWithIcon}>
                                                        <BiEnvelope className={styles.inputIcon} />
                                                        <input type="email" className={styles.inputWithIconField} placeholder="john@example.com"
                                                            value={form.email} onChange={(e) => setField("email", e.target.value)} required />
                                                    </div>
                                                </Field>
                                                <Field label="Phone">
                                                    <div className={styles.inputWithIcon}>
                                                        <BiPhone className={styles.inputIcon} />
                                                        <input type="tel" className={styles.inputWithIconField} placeholder="+1 (555) 000-0000"
                                                            value={form.phone} onChange={(e) => setField("phone", e.target.value)} required />
                                                    </div>
                                                </Field>
                                            </div>
                                            <Field label="Driver's Licence Number">
                                                <div className={styles.inputWithIcon}>
                                                    <BiIdCard className={styles.inputIcon} />
                                                    <input className={styles.inputWithIconField} placeholder="e.g. D123-4567-8900"
                                                        value={form.license} onChange={(e) => setField("license", e.target.value)} required />
                                                </div>
                                            </Field>
                                        </SectionCard>

                                        {/* Payment */}
                                        <SectionCard title="Payment" icon={<BiCreditCard />}>
                                            <Field label="Name on Card">
                                                <input className={styles.input} placeholder="John Doe" value={form.cardName}
                                                    onChange={(e) => setField("cardName", e.target.value)} required />
                                            </Field>
                                            <Field label="Card Number">
                                                <div className={styles.inputWithIcon}>
                                                    <BiCreditCard className={styles.inputIcon} />
                                                    <input className={`${styles.inputWithIconField} ${styles.inputMono}`}
                                                        placeholder="0000 0000 0000 0000"
                                                        value={form.cardNumber}
                                                        onChange={(e) => setField("cardNumber", formatCard(e.target.value))}
                                                        maxLength={19} required />
                                                </div>
                                            </Field>
                                            <div className={styles.inputGrid2}>
                                                <Field label="Expiry">
                                                    <input className={`${styles.input} ${styles.inputMono}`} placeholder="MM/YY"
                                                        value={form.expiry}
                                                        onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
                                                        maxLength={5} required />
                                                </Field>
                                                <Field label="CVV">
                                                    <input className={`${styles.input} ${styles.inputMono}`} placeholder="123"
                                                        value={form.cvv}
                                                        onChange={(e) => setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                        maxLength={4} required />
                                                </Field>
                                            </div>
                                            <div className={styles.secureNote}>
                                                <BiLock className={styles.secureIcon} />
                                                <span>Your payment information is encrypted and secure.</span>
                                            </div>
                                        </SectionCard>
                                    </div>

                                    {/* ── Right column: Order summary ── */}
                                    <div className={styles.summaryCol}>
                                        <p className={styles.summaryTitle}>Order Summary</p>

                                        <div className={styles.summaryItems}>
                                            {carData.map((item, i) => {
                                                const days = daysBetween(item.startDate, item.endDate);
                                                return (
                                                    <div key={item.vin} className={styles.summaryItem}>
                                                        <div className={styles.summaryItemLeft}>
                                                            <p className={styles.summaryItemName}>{item.make} {item.model}</p>
                                                            <p className={styles.summaryItemDays}>{days}d × ${item.pricePerDay}/day</p>
                                                        </div>
                                                        <p className={styles.summaryItemPrice}>${subtotals[i].toLocaleString()}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className={styles.summaryTotals}>
                                            <div className={styles.summaryRow}>
                                                <span>Subtotal</span>
                                                <span>${subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className={styles.summaryRow}>
                                                <span>Tax (8%)</span>
                                                <span>${tax.toLocaleString()}</span>
                                            </div>
                                            <div className={styles.summaryTotalRow}>
                                                <span>Total</span>
                                                <span className={styles.summaryTotalAmount}>${total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button type="submit" className={styles.confirmBtn}>
                                            Confirm Reservation
                                        </button>

                                        <p className={styles.termsNote}>
                                            By confirming, you agree to our terms of service and rental policy.
                                        </p>
                                    </div>

                                </div>
                            </form>
                        )}
                    </div>
                </MainBodyContainer>
            </div>
        </>
    );
}
