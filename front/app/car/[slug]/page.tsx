import { getCar } from "@/app/lib/CarApi";
import { Car } from "@/app/types/CarTypes";
import LeftColumn from "./components/leftColumn";
import RightColumn from "./components/rightColumn";
import ImageView from "./components/imageView";
import BackButton from "./components/backButton";
import MainBodyContainer from "@/app/components/containers/mainBodyContainer";
import NavHeader from "@/app/components/headers/navHeader";
import styles from "./components/carDetail.module.css";

const CarPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;

	const carData: Car = await getCar(slug);
	return (
		<div>
			<NavHeader white={false} />
			<MainBodyContainer className="mt-[20px]">
				<BackButton />
				<ImageView images={carData.images} />
				<div className={styles.twoColRow}>
					<LeftColumn carData={carData} />
					<RightColumn carData={carData} />
				</div>
			</MainBodyContainer>
		</div>
	);
};

export default CarPage;
