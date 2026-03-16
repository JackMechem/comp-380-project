import MainBodyContainer from "../components/containers/mainBodyContainer";
import LandingHeader from "../components/headers/landingHeader";
import { getFilteredCars } from "../lib/CarApi";
import { Car, CarPages } from "../types/CarTypes";
import PageButtons from "./components/pageButtons";

type BrowseSearchParams = {
	page?: string;
	pageSize?: string;
	select?: string;
	sortBy?: string;
	sortDir?: string;
	make?: string;
	model?: string;
	modelYear?: string;
	transmission?: string;
	drivetrain?: string;
	engineLayout?: string;
	fuel?: string;
	bodyType?: string;
	roofType?: string;
	vehicleClass?: string;
};

const BrowsePage = async ({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const str = (val: string | string[] | undefined): string | undefined =>
		Array.isArray(val) ? val[0] : val;

	const p = (await searchParams) ?? {};

	const carsPages: CarPages = await getFilteredCars({
		page: str(p.page) ? Number(str(p.page)) : undefined,
		pageSize: str(p.pageSize) ? Number(str(p.pageSize)) : undefined,
		modelYear: str(p.modelYear) ? Number(str(p.modelYear)) : undefined,
		select: str(p.select),
		sortBy: str(p.sortBy),
		sortDir: str(p.sortDir) as "asc" | "desc" | undefined,
		make: str(p.make),
		model: str(p.model),
		transmission: str(p.transmission),
		drivetrain: str(p.drivetrain),
		engineLayout: str(p.engineLayout),
		fuel: str(p.fuel),
		bodyType: str(p.bodyType),
		roofType: str(p.roofType),
		vehicleClass: str(p.vehicleClass),
	});

	return (
		<>
			<LandingHeader white={false} />
			<MainBodyContainer>
				{carsPages.cars.map((car: Car) => (
					<div key={car.vin}>
						<p>
							{car.make} {car.model}
						</p>
					</div>
				))}
				<PageButtons carsPages={carsPages} />
			</MainBodyContainer>
		</>
	);
};

export default BrowsePage;
