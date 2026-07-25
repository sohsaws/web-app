
export interface User {
    id: string,
    name: string,
    passwordHash?: string,
    username?: string,
    email?: string,
    bio?: string,
    emailVerified?: string,
    image?: string
}