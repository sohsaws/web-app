import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/User";
import { RequestEmailChange } from "../_components/RequestEmailChange";

export default async function ChangeEmailPendingPage() {
  const user = await getUser();

  if (!user?.email) {
    redirect("/login");
  }

  return <RequestEmailChange userEmail={user.email} />;
}
