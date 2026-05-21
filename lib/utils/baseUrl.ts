export const getBaseUrl = () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:3000";
	if (!baseUrl) {
		throw new Error("Missing configuration");
	}
	return baseUrl;
};
