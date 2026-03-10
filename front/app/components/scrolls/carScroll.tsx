import { Car } from "@/app/types/CarTypes";
import CarCard from "../cards/carCard";

interface CarScrollProps {
	cars: Car[];
}

const CarScroll = ({ cars }: CarScrollProps) => {
	return (
		<div className="w-full h-fit p-[20px] flex gap-[20px] overflow-x-scroll overflow-visible overflow-y-clip">
			{cars.map((car: Car) => (
				<CarCard key={car.vin} car={car} />
			))}
		</div>
	);
};

export default CarScroll;
