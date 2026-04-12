"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./adminForm.module.css";

interface MarkdownEditorProps {
	value: string;
	onChange: (v: string) => void;
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
	const [tab, setTab] = useState<"write" | "preview">("write");

	return (
		<div className={styles.mdEditor}>
			{/* Tab bar */}
			<div className={styles.mdTabBar}>
				{(["write", "preview"] as const).map((t) => (
					<button
						key={t}
						type="button"
						onClick={() => setTab(t)}
						className={`${styles.mdTab} ${tab === t ? styles.mdTabActive : ""}`}
					>
						{t}
					</button>
				))}
			</div>

			{/* Write */}
			{tab === "write" && (
				<textarea
					className={styles.mdTextarea}
					placeholder="Describe the vehicle — supports **markdown**…"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			)}

			{/* Preview */}
			{tab === "preview" && (
				<div className={styles.mdPreview}>
					{value.trim() ? (
						<ReactMarkdown>{value}</ReactMarkdown>
					) : (
						<p className={styles.mdEmpty}>Nothing to preview yet.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default MarkdownEditor;
