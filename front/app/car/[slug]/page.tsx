import LandingHeader from "@/app/components/headers/landingHeader";
import { getCar } from "@/app/lib/CarApi";
import { Car } from "@/app/types/CarTypes";

const CarPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;

	const car: Car = await getCar(slug);

	return (
		<div>
			<LandingHeader />
			<p>
				{car.make} {car.model} {car.vin}
			</p>
		</div>
	);
};

export default CarPage;
