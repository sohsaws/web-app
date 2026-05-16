import { auth } from "@/auth";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashBoard from "./_components/Dashboard";

export default async function Dashboard() {
	const cookieStore = await cookies();
	const session = await auth();

	const user = session?.user;

	return (
		<div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
			<DashBoard />
		</div>
	);
}
