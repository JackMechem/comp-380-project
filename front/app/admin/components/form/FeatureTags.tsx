"use client";

import { useState } from "react";
import { BiX } from "react-icons/bi";
import styles from "./adminForm.module.css";

interface FeatureTagsProps {
	features: string[];
	onChange: (tags: string[]) => void;
}

const FeatureTags = ({ features, onChange }: FeatureTagsProps) => {
	const [input, setInput] = useState("");

	const add = () => {
		const trimmed = input.trim();
		if (trimmed && !features.includes(trimmed)) {
			onChange([...features, trimmed]);
		}
		setInput("");
	};

	const remove = (tag: string) => onChange(features.filter((f) => f !== tag));

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			add();
		}
		if (e.key === "Backspace" && input === "" && features.length > 0) {
			remove(features[features.length - 1]);
		}
	};

	return (
		<div className={styles.featureTagsWrapper}>
			<div
				className={styles.featureTagsBox}
				onClick={(e) =>
					(e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()
				}
			>
				{features.map((tag, index: number) => (
					<span key={tag + index.toString()} className={styles.featureTag}>
						{tag}
						<button
							type="button"
							onClick={() => remove(tag)}
							className={styles.featureTagRemove}
						>
							<BiX />
						</button>
					</span>
				))}
				<input
					className={styles.featureTagInput}
					placeholder={
						features.length === 0
							? "e.g. Heated seats — press Enter to add"
							: "Add another…"
					}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={add}
				/>
			</div>
		</div>
	);
};

export default FeatureTags;
