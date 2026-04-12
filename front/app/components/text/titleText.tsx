import { PropsWithChildren } from "react";
import styles from "./titleText.module.css";

interface TitleTextProps extends PropsWithChildren {
	className?: string;
}

const TitleText = ({ children, className }: TitleTextProps) => {
	return (
		<div className={`${styles.titleText}${className ? " " + className : ""}`}>
			<h2>{children}</h2>
		</div>
	);
};

export default TitleText;
