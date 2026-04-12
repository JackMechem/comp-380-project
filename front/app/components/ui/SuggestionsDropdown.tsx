import { BiSearch } from "react-icons/bi";
import type { Suggestion } from "@/app/hooks/useSearchSuggestions";
import styles from "./SuggestionsDropdown.module.css";

interface SuggestionsDropdownProps {
	suggestions: Suggestion[];
	loading: boolean;
	highlightedIndex: number;
	onSelect: (s: Suggestion) => void;
	onHover: (index: number) => void;
}

const SuggestionsDropdown = ({
	suggestions,
	loading,
	highlightedIndex,
	onSelect,
	onHover,
}: SuggestionsDropdownProps) => (
	<div className={styles.dropdown}>
		{loading ? (
			<div className={styles.loading}>
				<div className={styles.spinner} />
			</div>
		) : (
			suggestions.map((s, i) => (
				<button
					key={s.vin}
					onMouseDown={(e) => {
						e.preventDefault();
						onSelect(s);
					}}
					onMouseEnter={() => onHover(i)}
					onMouseLeave={() => onHover(-1)}
					className={`${styles.item} ${highlightedIndex === i ? styles.itemHighlighted : ""}`}
				>
					<BiSearch className={styles.itemIcon} />
					<span>
						{s.make} {s.model}
					</span>
				</button>
			))
		)}
	</div>
);

export default SuggestionsDropdown;
