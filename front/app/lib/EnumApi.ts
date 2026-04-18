import { CarEnums } from "../types/CarEnums";
import { CarPages } from "../types/CarTypes";

const defaultHeaders: Record<string, string> = {
	"Content-Type": "application/json",
	...(process.env.API_KEY ? { "X-API-Key": process.env.API_KEY } : {}),
};

const defaultNext = {
	next: { revalidate: Number(process.env.REVALIDATE_SECONDS) },
};

export const getAllEnums = async (): Promise<CarEnums> => {
	const res = await fetch(
		`${process.env.API_BASE_URL}/enums`,
		{ ...defaultNext, headers: defaultHeaders },
	);
	if (!res.ok) throw new Error(await res.text());
	return res.json();
};
