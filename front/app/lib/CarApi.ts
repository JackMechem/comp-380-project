import { Car } from "../types/CarTypes";

const getAllCars = async (): Promise<Car[]> => {
	const res: Response = await fetch("http://127.0.0.1:7070/cars", {
		next: { revalidate: 3600 },
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch data from ${res.url}`);
	}

	const cars: Promise<Car[]> = res.json();
	return cars;
};

const getCar = async (_vin: string): Promise<Car> => {
	const res: Response = await fetch(`http://127.0.0.1:7070/cars/${_vin}`, {
		next: { revalidate: 3600 },
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch data from ${res.url}`);
	}

	const car: Promise<Car> = res.json();
	return car;
};

export { getAllCars, getCar };
