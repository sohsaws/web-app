
import type { auth } from '@/lib/auth';

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];