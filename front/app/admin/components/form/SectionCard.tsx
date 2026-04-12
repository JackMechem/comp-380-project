import styles from "./adminForm.module.css";

interface SectionCardProps {
	title: string;
	children: React.ReactNode;
	action?: React.ReactNode;
}

const SectionCard = ({ title, children, action }: SectionCardProps) => (
	<div className={styles.sectionCard}>
		<div className={styles.sectionCardHeader}>
			<p className={styles.sectionCardTitle}>{title}</p>
			{action}
		</div>
		{children}
	</div>
);

export default SectionCard;
