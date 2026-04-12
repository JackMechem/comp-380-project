import styles from "./adminForm.module.css";

export { styles as formStyles };

interface FieldProps {
	label: string;
	children: React.ReactNode;
}

const Field = ({ label, children }: FieldProps) => (
	<div className={styles.fieldParent}>
		<label className={styles.label}>{label}</label>
		{children}
	</div>
);

export default Field;
