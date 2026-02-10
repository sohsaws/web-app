import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const { name, email, password } = (await req.json() as {
            name: string,
            email: string,
            password: string;
        });

        const salt = 12;
        
        const hashed_password = await hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash: hashed_password,
            }
        });

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({
            status: "error",
            message: error,
        }), {status: 500});
    }
}