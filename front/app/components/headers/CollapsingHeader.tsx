"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import bigLogoImageWhite from "../../media/bigLogoWhite.svg";
import smallLogo from "../../media/smallLogo.svg";
import HeaderMenuButton from "../buttons/headerMenuButton";
import SmallSearchBar from "../searchBars/smallSearchBar";
import { useScrollCollapse } from "@/app/hooks/useScrollCollapse";
import styles from "./CollapsingHeader.module.css";

const THRESHOLD = 30;
const HYSTERESIS = 30;

interface CollapsingHeaderProps {
	white?: boolean;
}

const CollapsingHeader = ({ white = true }: CollapsingHeaderProps) => {
	const logoLinkRef = useRef<HTMLAnchorElement>(null);
	const isExpanded = useScrollCollapse(white, THRESHOLD, HYSTERESIS);
	const isWhite = white && isExpanded;

	return (
		<div className={`${styles.header} ${isWhite ? styles.headerWhite : styles.headerCompact}`}>
			<Link ref={logoLinkRef} href="/">
				{isWhite ? (
					<Image
						width={200}
						height={400}
						src={bigLogoImageWhite}
						className="h-full"
						alt="FCR Logo"
					/>
				) : (
					<Image width={55} height={55} src={smallLogo} alt="FCR Logo" />
				)}
			</Link>
			{!isWhite && <SmallSearchBar />}
			<div className={isWhite ? styles.menuIconWhite : styles.menuIconCompact}>
				<HeaderMenuButton />
			</div>
		</div>
	);
};

export default CollapsingHeader;
