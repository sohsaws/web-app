'use client';

import Image from 'next/image';
import { authClient } from '@/lib/auth/auth-client';
import { useState } from "react";

export function GoogleAuthButton() {

    const [loading, setLoading] = useState(false);

    const signInGoogle = async () => {
        try {
            setLoading(true);
            const { error } = await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/dashboard',
            });
            if (error) {
                // какая то обработка ошибки, в будущем пригодиться
                console.log(error);
            }

        } catch (error) {
            console.log("Something went wrong: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={() => signInGoogle()}
            type="submit"
            disabled={loading}
            className="cursor-pointer flex items-center justify-center gap-3 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black transition-all"
        >
            <Image
                src="/imgs/Google.png"
                alt="Google"
                width={16}
                height={16}
            />
            <span>Google</span>
        </button>
    )
}