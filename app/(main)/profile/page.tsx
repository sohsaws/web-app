"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Profile() {
    const session = useSession();
    const router = useRouter();

    const user = session.data?.user;

    if (!user) {
        router.push("/");
    }

    return (
        <div>
            <Image 
                src={user?.image ? user.image : "/imgs/User.png"}
                alt={`profile photo of ${user?.name}`}
                width={180}
                height={180}
                className="flex items-center justify-center rounded-full mt-8"
            />
            <div className='mt-8'>
                <p className='mb-3'>ID: {user?.id}</p>
                <p className='mb-3'>Name: {user?.name}</p>
                <p className='mb-3'>Email: {user?.email}</p>
            </div>
        </div>
    );
}