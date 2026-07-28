
import NotificationsContent from "./_components/NotificationsContent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return (
		<div>
			<NotificationsContent />
		</div>
	);
}
