import { auth } from "@clerk/nextjs/server";
import BillingContent from "./_components/BillingContent";

export default async function BillingPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return (
    <div>
      <BillingContent />
    </div>
  );
}
