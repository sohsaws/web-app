import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <h1>Change Password</h1>
        </div>
    );
}