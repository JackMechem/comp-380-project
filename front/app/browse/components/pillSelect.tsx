"use client";

import styles from "./pillSelect.module.css";

interface PillOption {
    paramId: string;
    displayText: string;
}

interface PillSelectProps {
    options: PillOption[];
    selected?: string;
    onChange: (value: string | null) => void;
}

const PillSelect = ({ options, selected, onChange }: PillSelectProps) => {
    return (
        <div className={styles.pillGroup}>
            {options.map((opt) => (
                <button
                    key={opt.paramId}
                    onClick={() => onChange(selected === opt.paramId ? null : opt.paramId)}
                    className={`${styles.pill} ${selected === opt.paramId ? styles.pillActive : ""}`}
                >
                    {opt.displayText}
                </button>
            ))}
        </div>
    );
};

export default PillSelect;
