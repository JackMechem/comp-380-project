import { FaCar, FaTruckPickup } from "react-icons/fa";
import { GiCutDiamond } from "react-icons/gi";
import { IoSpeedometer } from "react-icons/io5";
import styles from "./landingPageFilterButtons.module.css";

const LandingPageFilterButtons = () => {
	return (
		<div className={styles.wrapper}>
            <div className={`${styles.filterBtn} ${styles.filterBtnActive}`}>
                <FaCar />
                Featured
            </div>
            <div className={styles.filterBtn}>
                <FaTruckPickup />
                Pickup Trucks
            </div>
            <div className={styles.filterBtn}>
                <IoSpeedometer />
                Sport
            </div>
            <div className={styles.filterBtn}>
                <GiCutDiamond />
                Luxury
            </div>
		</div>
	);
};

export default LandingPageFilterButtons;
