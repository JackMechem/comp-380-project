import { Car } from "@/app/types/CarTypes";
import Image from "next/image";
import Link from "next/link";
import { BiCar } from "react-icons/bi";
import { GiCarSeat } from "react-icons/gi";
import { PiEngine } from "react-icons/pi";
import styles from "./carGridCard.module.css";

const CarGridCard = ({ car }: { car: Car }) => (
	<Link href={`/car/${car.vin}`} className={styles.card}>
		<Image
			width={400}
			height={250}
			alt={`${car.make} ${car.model}`}
			src={car.images[0]}
			className={styles.image}
			loading="lazy"
		/>
		<div className={styles.body}>
			<div className={styles.titleGroup}>
				<h2 className={styles.carName}>
					{car.make} {car.model}
				</h2>
				<p className={styles.carYear}>{car.modelYear}</p>
			</div>
			<div className={styles.stats}>
				<div className={styles.stat}>
					<BiCar />
					<p className={styles.statCapitalize}>{car.vehicleClass}</p>
				</div>
				<div className={styles.stat}>
					<GiCarSeat />
					<p>{car.seats} seats</p>
				</div>
				<div className={styles.stat}>
					<PiEngine />
					<p className={styles.statCapitalize}>
						{car.engineLayout === "DUAL_MOTOR" || car.engineLayout === "SINGLE_MOTOR"
							? car.engineLayout
							: `${car.engineLayout} ${car.cylinders}`}
					</p>
				</div>
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

export default CarGridCard;
