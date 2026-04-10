import { Suspense } from "react";
import CarScroll from "./components/scrolls/carScroll";
import TitleText from "./components/text/titleText";
import { getFilteredCars } from "./lib/CarApi";
import { Car, CarPages } from "./types/CarTypes";
import MainBodyContainer from "./components/containers/mainBodyContainer";
import NavHeader from "./components/headers/navHeader";
import LandingHero from "./components/heros/landingHero";
import CarBrandCard from "./components/cards/carBrandCard";
import BrandScroll from "./components/scrolls/brandScroll";
import BmwLogo from "./media/carBrandLogos/bmw.svg";
import BmwCarImage from "./media/transparentCarImages/bmw.png";
import MercedesLogo from "./media/carBrandLogos/mercedes.svg";
import MercedesCarImage from "./media/transparentCarImages/mercedesAmg.png";
import PorscheLogo from "./media/carBrandLogos/porsche.svg";
import PorscheCarImage from "./media/transparentCarImages/porsche.png";
import AudiLogo from "./media/carBrandLogos/audi.svg";
import AudiCarImage from "./media/transparentCarImages/audi.png";
import VolkswagenLogo from "./media/carBrandLogos/volkswagen.svg";
import VolkswagenCarImage from "./media/transparentCarImages/volkswagen.png";
import Link from "next/link";

// --- Skeletons ---

const CarCardSkeleton = () => (
	<div className="sm:min-w-[250px] w-full rounded-lg overflow-hidden bg-primary shadow-md">
		<div className="w-full h-[200px] bg-third animate-pulse" />
		<div className="px-[20px] py-[15px] flex flex-col gap-[10px]">
			<div className="flex justify-between items-start">
				<div className="flex flex-col gap-[6px] flex-1">
					<div className="h-[20px] w-[70%] bg-third rounded animate-pulse" />
					<div className="h-[14px] w-[30%] bg-third rounded animate-pulse" />
				</div>
				<div className="w-[25px] h-[25px] bg-third rounded animate-pulse" />
			</div>
			<div className="flex justify-between items-center">
				<div className="h-[20px] w-[60px] bg-third rounded animate-pulse" />
				<div className="h-[30px] w-[80px] bg-third rounded-full animate-pulse" />
			</div>
		</div>
	</div>
);

const CarScrollSkeleton = () => (
	<div className="w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-[10px] gap-y-[20px] px-[10px] py-[10px]">
		{Array.from({ length: 5 }).map((_, i) => (
			<CarCardSkeleton key={i} />
		))}
	</div>
);

const CarBrandCardSkeleton = () => (
	<div className="flex flex-col gap-[40px] md:min-w-[500px] md:w-[500px] min-w-full bg-primary-dark rounded-lg px-[30px] py-[25px] shadow-md">
		<div className="h-[52px] w-full flex items-center justify-between">
			<div className="h-[40px] w-[40px] bg-third rounded animate-pulse" />
			<div className="h-[20px] w-[80px] bg-third rounded animate-pulse" />
		</div>
		<div className="h-[200px] w-full bg-third rounded animate-pulse" />
		<div className="flex justify-between items-center">
			<div className="flex flex-col gap-[6px]">
				<div className="h-[14px] w-[60px] bg-third rounded animate-pulse" />
				<div className="h-[28px] w-[100px] bg-third rounded animate-pulse" />
			</div>
			<div className="h-[36px] w-[120px] bg-third rounded-full animate-pulse" />
		</div>
	</div>
);

const BrandScrollSkeleton = () => (
	<div className="flex gap-[15px] p-[10px] w-full overflow-hidden">
		{Array.from({ length: 3 }).map((_, i) => (
			<CarBrandCardSkeleton key={i} />
		))}
	</div>
);

// --- Async data components ---

const BrandScrollSection = async () => {
	const [
		mercedesPages,
		bmwPages,
		porschePages,
		audiPages,
		volkswagenPages,
	] = await Promise.all([
		getFilteredCars({ pageSize: 1, page: 1, sortBy: "pricePerDay", make: "Mercedes-Benz", sortDir: "asc", select: "pricePerDay" }),
		getFilteredCars({ pageSize: 1, page: 1, sortBy: "pricePerDay", make: "BMW", sortDir: "asc", select: "pricePerDay" }),
		getFilteredCars({ pageSize: 1, page: 1, sortBy: "pricePerDay", make: "Porsche", sortDir: "asc", select: "pricePerDay" }),
		getFilteredCars({ pageSize: 1, page: 1, sortBy: "pricePerDay", make: "Audi", sortDir: "asc", select: "pricePerDay" }),
		getFilteredCars({ pageSize: 1, page: 1, sortBy: "pricePerDay", make: "Volkswagen", sortDir: "asc", select: "pricePerDay" }),
	]);

	return (
		<BrandScroll>
			<CarBrandCard title="Porsche" startingPrice={porschePages.data[0].pricePerDay} logoImage={PorscheLogo.src} carImage={PorscheCarImage.src} />
			<CarBrandCard title="BMW" startingPrice={bmwPages.data[0].pricePerDay} logoImage={BmwLogo.src} carImage={BmwCarImage.src} />
			<CarBrandCard title="Mercedes-Benz" startingPrice={mercedesPages.data[0].pricePerDay} logoImage={MercedesLogo.src} carImage={MercedesCarImage.src} />
			<CarBrandCard title="Audi" startingPrice={audiPages.data[0].pricePerDay} logoImage={AudiLogo.src} carImage={AudiCarImage.src} />
			<CarBrandCard title="Volkswagen" startingPrice={volkswagenPages.data[0].pricePerDay} logoImage={VolkswagenLogo.src} carImage={VolkswagenCarImage.src} />
		</BrandScroll>
	);
};

const CheapCarsSection = async () => {
	const carPagesDataCheap: CarPages = await getFilteredCars({
		minPricePerDay: 0,
		maxPricePerDay: 100,
	});
	const carsDataCheap: Car[] = carPagesDataCheap.data;

	if (carsDataCheap.length === 0) return null;
	return <CarScroll cars={carsDataCheap} />;
};

// --- Page ---

const Home = () => {
	return (
		<>
			<NavHeader />
			<LandingHero />
			<MainBodyContainer className="flex flex-col gap-[40px]">
				<Suspense fallback={<BrandScrollSkeleton />}>
					<BrandScrollSection />
				</Suspense>

				<div>
					<Link
						href={"/browse?minPricePerDay=0&maxPricePerDay=100"}
						className="flex justify-between items-center mt-[20px]"
					>
						<TitleText>Cars Under $100/day</TitleText>
						<p className="text-accent text-[12pt] font-[500]">
							See more {"->"}
						</p>
					</Link>
					<Suspense fallback={<CarScrollSkeleton />}>
						<CheapCarsSection />
					</Suspense>
				</div>
			</MainBodyContainer>
		</>
	);
};

export default Home;
