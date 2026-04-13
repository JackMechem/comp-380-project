"use client";
import { useEffect, useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

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
		<button onClick={toggle} style={{ background: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "6px" }} aria-label="Toggle theme">
			{dark ? <BsSun /> : <BsMoon />}
		</button>
	);
};

export default ThemeToggle;
