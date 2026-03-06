import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const { name, username, email, password } = (await req.json() as {
            name: string,
            username: string,
            email: string,
            password: string;
        });

        const salt = 12;
        const hashed_password = await hash(password, salt);

        const usr = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email.toLowerCase()},
                    {username: username.toLowerCase()}
                ]
            }
        })

        if (usr) {
            return NextResponse.json({
                status: "error",
                message: "This user already exists."
            }, {status: 400})
        }

        const newUser = await prisma.user.create({
            data: {
                name: name,
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                passwordHash: hashed_password,
            }
        });

        return NextResponse.json({
            user: {
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({
            status: "error",
            message: error,
        }), { status: 500 });
    }
}