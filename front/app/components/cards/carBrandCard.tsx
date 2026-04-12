import Image from "next/image";
import Link from "next/link";
import styles from "./carBrandCard.module.css";

interface CarBrandCardProps {
	title: string;
	startingPrice: number;
	logoImage: string;
	carImage: string;
    searchURL?: string;
}

const CarBrandCard = ({
	title,
	startingPrice,
	logoImage,
	carImage,
    searchURL = "/browse?make=" + title.toLowerCase()
}: CarBrandCardProps) => {
	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<Image
					src={logoImage}
					alt={title + " logo"}
					width={50}
					height={50}
					className={styles.logo}
				/>
				<p className={styles.brandName}>{title}</p>
			</div>
			<Image
				src={carImage}
				alt={title + " car image"}
				width={440}
				height={200}
				className={styles.carImage}
			/>
			<div className={styles.footer}>
				<div>
					<p className={styles.priceLabel}>Starting at</p>
					<h3 className={styles.price}>${startingPrice}<span className={styles.priceUnit}>/day</span></h3>
				</div>
				<Link href={searchURL} className={styles.browseBtn}>Browse {title}</Link>
			</div>
		</div>
	);
};

export default CarBrandCard;
