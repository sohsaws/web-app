import { randomUUID } from "crypto";

export const generateToken = (lifeMinutes: number) => {
    const token = randomUUID();
    const tokenObject = {
        token: token,
        expiresAt: new Date(Date.now() + lifeMinutes * 60 * 1000),
        createdAt: new Date(),
    }
    return tokenObject;
}