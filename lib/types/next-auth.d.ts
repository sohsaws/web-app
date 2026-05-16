import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface User extends DefaultUser {
		username?: string | null;
		emailVerified?: Date | null;
	}

	interface Session {
		user: {
			username?: string | null;
			emailVerified?: Date | null;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		image?: string | null;
		username?: string | null;
		emailVerified?: Date | null;
	}
}
