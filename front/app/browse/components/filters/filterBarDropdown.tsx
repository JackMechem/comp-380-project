"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BiChevronDown } from "react-icons/bi";
import styles from "./filterBarDropdown.module.css";

interface QueryOption {
	paramId: string;
	displayText?: string;
}

interface FilterBarDropdownProps {
	label: string;
	options: QueryOption[];
	defaultValue?: string;
	showAll?: boolean;
	className?: string;
	onChange: (value: string | null) => void;
}

const FilterBarDropdown = ({
	label,
	options,
	defaultValue,
	showAll = true,
	className,
	onChange,
}: FilterBarDropdownProps) => {
	const [selected, setSelected] = useState<string>(
		defaultValue ?? (showAll ? "" : options[0].paramId),
	);
	const [open, setOpen] = useState(false);
	const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const selectedLabel =
		selected === ""
			? "All"
			: (options.find((o) => o.paramId === selected)?.displayText ?? selected);

	const openMenu = () => {
		if (!triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		const menuWidth = 160;
		let left = rect.left;
		if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
		setMenuStyle({
			position: "fixed",
			top: rect.bottom + 6,
			left,
			minWidth: menuWidth,
			zIndex: 9999,
		});
		setOpen(true);
	};

	const pick = (value: string) => {
		setSelected(value);
		onChange(value === "" ? null : value);
		setOpen(false);
	};

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			const t = e.target as Node;
			if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t))
				setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const allOptions = showAll ? [{ paramId: "", displayText: "All" }, ...options] : options;

	return (
		<div className={`${styles.wrapper} ${className ?? ""}`}>
			{label !== "" && <label className={styles.label}>{label}</label>}
			<button
				ref={triggerRef}
				type="button"
				onClick={() => (open ? setOpen(false) : openMenu())}
				className={`${label !== "" ? styles.selectWrap : styles.selectWrapNoLabel} ${open ? styles.selectWrapOpen : ""}`}
			>
				<span className={styles.selectInner}>{selectedLabel}</span>
				<BiChevronDown
					className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
				/>
			</button>

			{open && typeof window !== "undefined" &&
				createPortal(
					<div ref={menuRef} style={menuStyle} className={styles.menu}>
						{allOptions.map((option) => (
							<button
								key={option.paramId}
								type="button"
								onMouseDown={(e) => { e.preventDefault(); pick(option.paramId); }}
								className={`${styles.menuItem} ${selected === option.paramId ? styles.menuItemActive : ""}`}
							>
								{option.displayText ?? option.paramId}
							</button>
						))}
					</div>,
					document.body,
				)}
		</div>
	);
};

export default FilterBarDropdown;
