
import DashBoard from "./_components/Dashboard";
import { auth, currentUser } from '@clerk/nextjs/server';


export default async function Dashboard() {

	const { isAuthenticated, sessionStatus } = await auth();
	const user = await currentUser();

	console.log('Dashboard page: ', isAuthenticated, sessionStatus, user);

	return (
		<div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
			<DashBoard />
		</div>
	);
}
