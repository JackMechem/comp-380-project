import styles from "./defaultProfilePhoto.module.css";

const DefaultProfilePhoto = ({ totalHeight, headSize }: { totalHeight: number, headSize: number }) => {
	return (
		<div style={{ height: totalHeight }} className={styles.wrapper}>
			<div className={styles.body} />
			<div style={{ width: headSize }} className={styles.head} />
		</div>
	);
};

export default DefaultProfilePhoto;
