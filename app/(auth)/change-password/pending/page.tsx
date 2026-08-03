import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/User";
import { RequestPasswordChange } from "../_components/RequestPasswordChange";

function OAuthMessage() {
  return (
    <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-md rounded-2xl border border-white/5 px-8 py-12 text-center">
        <Info size={48} strokeWidth={1.5} className="text-neutral-400" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">
            No password on this account
          </h1>
          <p className="text-sm text-neutral-500">
            Your account uses OAuth (Google, Github and etc) Sign-In. You can
            manage your password directly through Google.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function ChangePasswordPendingPage() {
  const user = await getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  if (!user.passwordHash) {
    return <OAuthMessage />;
  }

  return <RequestPasswordChange userEmail={user.email} />;
}
