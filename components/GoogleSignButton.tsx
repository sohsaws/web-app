'use client';

import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/shared/types';

export function GoogleAuthButton() {

    const { signIn, errors, fetchStatus } = useSignIn();

    const signInWithSSO = async (strategy: OAuthStrategy) => {

        const { error } = await signIn.sso({
            strategy,
            redirectCallbackUrl: '/login/sso-callback',
            redirectUrl: '/dashboard',
        })

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            return;
        }

        if (errors) {
            console.error(JSON.stringify(errors, null, 2));
        }

        if (signIn.status === 'needs_second_factor') {  
            console.log('Needs second factor');
        } else if (signIn.status === 'needs_client_trust') {
            console.log('Needs client trust');
        } else {
            console.error('Sign-in attempt not complete: ', signIn.status);
        }
    }


    return (
        <button
			onClick={() => signInWithSSO('oauth_google')}
			type="submit"
            disabled={fetchStatus === 'fetching'}
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