import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotificationsContent from "./_components/NotificationsContent";

export default async function NotificationsPage() {

  return (
    <div>
      <NotificationsContent />
    </div>
  );
}
