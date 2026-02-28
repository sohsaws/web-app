

export const getBaseUrl = () => {
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
        throw new Error("Missing configuration");
    }
    return baseUrl;
}