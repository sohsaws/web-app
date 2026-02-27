import BillingContent from "./_components/BillingContent";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BillingPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <BillingContent />
        </div>
    );
}