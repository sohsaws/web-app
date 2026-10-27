import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>(), sentinelClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
