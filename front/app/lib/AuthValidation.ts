export const validateCredentials = async (
	username: string,
	password: string,
) => {
	const token = btoa(`${username}:${password}`);

	const res: Response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`,
		{
			next: { revalidate: false },
			headers: {
				Authorization: `Basic ${token}`,
				"Content-Type": "application/json",
			},
		},
	);

	return res.status;
};
