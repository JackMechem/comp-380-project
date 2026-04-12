import { PiSparkleFill } from "react-icons/pi";
import styles from "./adminForm.module.css";

interface AiButtonProps {
	onClick: () => void;
	loading: boolean;
}

const AiButton = ({ onClick, loading }: AiButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={loading}
		title="Fill with AI"
		className={styles.aiBtn}
	>
		<PiSparkleFill className={`${styles.aiBtnIcon} ${loading ? "animate-pulse" : ""}`} />
		{loading ? "…" : "AI"}
	</button>
);

export default AiButton;
