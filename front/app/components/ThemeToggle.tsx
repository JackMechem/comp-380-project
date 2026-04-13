"use client";
import { useEffect, useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		setDark(document.documentElement.getAttribute("data-theme") === "dark");
	}, []);

	const toggle = () => {
		const next = !dark;
		setDark(next);
		if (next) {
			document.documentElement.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.removeAttribute("data-theme");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<button
			onClick={toggle}
			className={`${styles.toggle} ${dark ? styles.isDark : ""}`}
			aria-label="Toggle theme"
		>
			<BsSun className={styles.iconSun} />
			<BsMoon className={styles.iconMoon} />
			<span className={`${styles.thumb} ${dark ? styles.dark : ""}`}>
				{dark ? <BsMoon /> : <BsSun />}
			</span>
		</button>
	);
};

export default ThemeToggle;
