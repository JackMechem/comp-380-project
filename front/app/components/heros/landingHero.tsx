import Image from "next/image";
import LandingSearchBar from "../searchBars/landingSearchBar";
import CarTransparentBg from "../../media/transparentCar.png";
import styles from "./landingHero.module.css";

const LandingHero = () => {
	return (
		<div className={styles.hero}>
			<div
				className={styles.bgCircle}
				style={{
					background:
						"linear-gradient(180deg, var(--Primary, #FDFDFF) 0%, #C69192 50%, var(--Accent, #993537) 100%)",
				}}
			>
				<div
					className={styles.bgCircleInner}
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.3' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					}}
				/>
			</div>
			<h1 className={styles.headline}>Get a Fast Car Fast</h1>
			<p className={styles.subheadline}>Rent any car, anytime, anywhere</p>
			<LandingSearchBar />
			<Image
				src={CarTransparentBg.src}
				alt={"Car transparent background"}
				width={600}
				height={600}
				className={styles.carImage}
			/>
		</div>
	);
};

export default LandingHero;
