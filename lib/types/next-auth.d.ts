import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        username?: string | null;
    }

    interface Session {
        user: {
            username?: string | null;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username?: string | null;
    }
}