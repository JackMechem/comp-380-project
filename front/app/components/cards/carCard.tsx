import { Car } from "@/app/types/CarTypes";
import Image from "next/image";
import Link from "next/link";
import { BiHeart } from "react-icons/bi";
import styles from "./carCard.module.css";

interface CarCardProps {
	car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
	return (
		<Link href={`car/${car.vin}`} className={styles.card}>
			<Image
				width={300}
				height={300}
				alt={"car image"}
				src={car.images[0]}
				className={styles.image}
				loading="lazy"
			/>
			<div className={styles.body}>
				<div className={styles.titleRow}>
					<div className={styles.titleGroup}>
						<h2 className={styles.title}>
							{car.make} {car.model}
						</h2>
						<p className={styles.year}>{car.modelYear}</p>
					</div>
					<BiHeart className={styles.heartIcon} />
				</div>
				<div className={styles.priceRow}>
					<h2 className={styles.price}>
						${car.pricePerDay}
						<span className={styles.priceUnit}>/day</span>
					</h2>
				</div>
			</div>
		</Link>
	);
};

export default CarCard;
