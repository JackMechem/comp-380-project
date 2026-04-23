import Link from "next/link";
import Image from "next/image";
import { BiInfoCircle, BiImage, BiCode } from "react-icons/bi";
import bigLogo from "@/app/media/bigLogo.svg";
import styles from "./PageFooter.module.css";

const PageFooter = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* Brand — centered on top */}
                <div className={styles.brandRow}>
                    <Image
                        src={bigLogo}
                        alt="FCR Inc."
                        height={60}
                        className={styles.logoImg}
                    />
                    <p className={styles.brandDesc}>
                        A modern car rental platform built to explore full-stack
                        development concepts — from dynamic filtering and reservations
                        to payments and role-based access control.
                    </p>
                </div>

                <div className={styles.divider} />

                {/* Info columns */}
                <div className={styles.grid}>
                    {/* Disclaimer column */}
                    <div className={styles.col}>
                        <div className={styles.colHeader}>
                            <BiInfoCircle className={styles.colIcon} />
                            <h3 className={styles.colTitle}>Proof of Concept</h3>
                        </div>
                        <p className={styles.colBody}>
                            FCR Inc. is an academic project and is not a real car rental
                            service. No actual vehicles are available for rent. All pricing,
                            availability, and reservation data is simulated for demonstration
                            purposes only.
                        </p>
                        <p className={styles.colBody}>
                            Any payments processed through this platform use Stripe&apos;s test
                            mode. No real transactions occur.
                        </p>
                    </div>

                    {/* Image sources column */}
                    <div className={styles.col}>
                        <div className={styles.colHeader}>
                            <BiImage className={styles.colIcon} />
                            <h3 className={styles.colTitle}>Image Sources</h3>
                        </div>
                        <p className={styles.colBody}>
                            Vehicle images displayed on this site are borrowed from various
                            sources across the internet for educational and demonstration
                            purposes only. Primary sources include:
                        </p>
                        <ul className={styles.sourceList}>
                            <li>Cars &amp; Bids — carsandbids.com</li>
                            <li>Turo — turo.com</li>
                            <li>Various manufacturer press photos</li>
                        </ul>
                        <p className={styles.colBody}>
                            No copyright infringement is intended. All images remain the
                            property of their respective owners.
                        </p>
                    </div>

                    {/* Tech column */}
                    <div className={styles.col}>
                        <div className={styles.colHeader}>
                            <BiCode className={styles.colIcon} />
                            <h3 className={styles.colTitle}>Built With</h3>
                        </div>
                        <ul className={styles.techList}>
                            <li>Next.js &amp; React</li>
                            <li>TypeScript</li>
                            <li>CSS Modules</li>
                            <li>Java &amp; Javalin</li>
                            <li>PostgreSQL &amp; Hibernate</li>
                            <li>Stripe</li>
                            <li>Zustand</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Bottom bar */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} FCR Inc. — Academic project. Not a real
                        business.
                    </p>
                    <div className={styles.bottomLinks}>
                        <Link href="/browse" className={styles.bottomLink}>Browse cars</Link>
                        <Link href="/login" className={styles.bottomLink}>Sign in</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PageFooter;
