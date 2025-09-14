import { getUserByEmail } from "@/db/model/userModel";
import { compareHash } from "@/utils/bcryptjs";
import { createToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import * as z from "zod";

type LoginResponse<T> = {
    statusCode: number;
    message?: string;
    data?: T;
    error?: string;
};

const loginInputSchema = z.object({
    email: z
        .string()
        .min(1, { error: 'Email is required' })
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            error: 'Email format is invalid',
        }),
    password: z.string()
        .min(1, { error: 'Password is required' })
});

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const parsedInput = loginInputSchema.safeParse(body);

        if (!parsedInput.success) {
            const errorMessage = parsedInput.error.issues[0]?.message;
            return NextResponse.json<LoginResponse<never>>({
                statusCode: 400,
                error: errorMessage
            }, { status: 400 });
        }

        const user = await getUserByEmail(parsedInput.data.email);
        if (!user || !compareHash(parsedInput.data.password, user.password)) {
            throw new Error('Invalid email or password');
        }

        const payload = {
            id: user._id.toString(),
        }

        const token = await createToken(payload);

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: false,
            expires: new Date(Date.now() + 1000 * 60 * 60),
            path: "/",
            sameSite: "lax",
        })

        return NextResponse.json<LoginResponse<unknown>>({
            statusCode: 200,
            message: 'Login successful',
            data: {
                token: token,
            }
        }, {
            status: 200
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json<LoginResponse<never>>({
                statusCode: 401,
                error: error.message
            }, {
                status: 401
            });
        }

        return NextResponse.json<LoginResponse<never>>({
            statusCode: 500,
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}