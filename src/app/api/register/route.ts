import { registerUser } from '@/db/model/userModel';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

type UserResponse<T> = {
    statusCode: number;
    message?: string;
    data?: T;
    error?: string | string[];
};

const userInputSchema = z.object({
    name: z.string().trim().min(1, { error: 'Name is required' }),
    username: z.string().trim().min(1, { error: 'Username is required' }),
    email: z
        .string()
        .min(1, { error: 'Email is required' })
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            error: 'Email format is invalid',
        }),
    password: z.string()
        .min(1, { error: 'Password is required' })
        .min(5, { error: 'Password must be at least 5 characters long' }),
});

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const parsedInput = userInputSchema.safeParse(body);

        if (!parsedInput.success) {
            const allErrors = parsedInput.error.issues.map((issue) => issue.message);
            return NextResponse.json<UserResponse<never>>({
                statusCode: 400,
                error: allErrors,
            }, { status: 400 });
        }

        const response = await registerUser(parsedInput.data);

        return NextResponse.json<UserResponse<unknown>>({
            statusCode: 201,
            data: response,
        }, { status: 201 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json<UserResponse<never>>({
                statusCode: 400,
                error: error.message,
            }, { status: 400 });
        }

        return NextResponse.json<UserResponse<never>>({
            statusCode: 500,
            error: 'Internal Server Error',
        }, { status: 500 });
    }
};