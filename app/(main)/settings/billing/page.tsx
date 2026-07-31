import BillingContent from "./_components/BillingContent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BillingPage() {
	const { isAuthenticated, redirectToSignIn } = await auth();

	if (!isAuthenticated) {
		return redirectToSignIn;
	}

	return (
		<div>
			<BillingContent />
		</div>
	);
}
