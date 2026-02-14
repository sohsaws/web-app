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

        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            } 
        })

        if (user) {
            return NextResponse.json({
                status: "error",
                message: "User already registred in this email",
            }, {status: 400});
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash: hashed_password,
            }
        });

        return NextResponse.json({
            user: {
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({
            status: "error",
            message: error,
        }), {status: 500});
    }
}