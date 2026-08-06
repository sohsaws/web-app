"use client";

import MyToast from "@/components/Toast";
import Image from "next/image";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth/auth-client"; 

export default function DashBoard() {

	MyToast();
	const router = useRouter();

	const { 
        data: session, 
        isPending, //loading state
        error, //error object
    } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
			</div>
		)
	}

	if (!session) {
		toast.error('Please, log in to access the page');
		router.push('/login');
		return;
	}
	
	const user = session.user;

	return (
		<main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">
			<section className="w-full rounded-3xl border border-white/5 bg-[#080808] relative overflow-hidden">
				<div className="p-8 flex items-center justify-between">
					<div>
						<h2 className="text-base font-medium text-white">
							Revenue Analytics
						</h2>
						<p className="text-xs text-neutral-500 mt-1">
							Growth comparison year over year
						</p>
						<Image
							src={user.image ? user.image : "/imgs/User.png"}
							alt={`profile photo of ${user.name}`}
							width={180}
							height={180}
							className="flex items-center justify-center rounded-full mt-8"
						/>
						<div className="mt-8">
							<p className="mb-3">ID: {user.id}</p>
							<p className="mb-3">Name: {user.name}</p>
							<p className="mb-3">Email:{user.email}</p>
						</div>
						{error ? (
							Object.entries(error).map((e, i) => (
								<p key={i}>{e[0] + ': ' + e[1]}</p>
							))
						) : null}						
					</div>
					<button className="p-2 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-white/10 hover:bg-white/5 rounded-lg"></button>
				</div>
			</section>
		</main>
	);
}
