import { ReactNode } from "react";
import styles from "./mainBodyContainer.module.css";

const MainBodyContainer = ({ children, className }: { children: ReactNode, className?: string }) => {
	return (
		<div className={`${styles.container}${className ? " " + className : ""}`}>
			{children}
		</div>
	);
};

export default MainBodyContainer;
