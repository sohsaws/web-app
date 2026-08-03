import { auth, currentUser } from "@clerk/nextjs/server";
import DashBoard from "./_components/Dashboard";

export default async function Dashboard() {

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
      <DashBoard />
    </div>
  );
}
