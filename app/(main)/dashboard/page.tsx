
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashBoard from "./_components/Dashboard.server";
import { ReactElement } from 'react';

export default async function Dashboard(): Promise<ReactElement> {

	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		redirect('/login?reason=unauthorized')
	}

	const user = session.user;

	return (
		<div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
			<DashBoard user={user}/>
		</div>
	);
}
