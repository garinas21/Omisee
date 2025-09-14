import { addWishlist, getWishlistsByUser, getWishlistsWithProductsByUser } from "@/db/model/wishlistModel";
import { NextRequest, NextResponse } from "next/server";

import * as z from 'zod';
type WishlistResponse<T> = {
    statusCode: number;
    message?: string;
    data?: T;
    error?: string;
}

const wishlistInputSchema = z.object({
    userId: z.string({
        error: 'User is required'
    }),
    productId: z.string({
        error: 'Product is required'
    })
})

export const GET = async (request: NextRequest) => {
    try {
        const userId = request.headers.get("x-user-id");
        const { searchParams } = new URL(request.url);
        const includeProducts = searchParams.get("include") === "products";

        if (!userId) {
            throw new Error('UNAUTHORIZED')
        }

        let wishlists;
        if (includeProducts) {
            wishlists = await getWishlistsWithProductsByUser(userId);
        } else {
            wishlists = await getWishlistsByUser(userId);
        }

        return NextResponse.json({
            statusCode: 200,
            data: wishlists,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json({
                statusCode: 401,
                error: error.message,
            }, {
                status: 401
            })
        }
        return NextResponse.json({
            statusCode: 500,
            error: "Internal Server Error",
        }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const userId = request.headers.get("x-user-id");

        if (!userId) {
            throw new Error('UNAUTHORIZED');
        }

        const validatedData = wishlistInputSchema.parse({
            userId,
            productId: body.productId,
        });

        const response = await addWishlist(validatedData.userId, validatedData.productId);

        return NextResponse.json<WishlistResponse<unknown>>({
            statusCode: 201,
            data: response
        }, {
            status: 201
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errMessage = error.issues[0].message;

            return NextResponse.json<WishlistResponse<never>>({
                statusCode: 400,
                error: errMessage
            }, {
                status: 400
            });
        }

        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json<WishlistResponse<never>>({
                statusCode: 401,
                error: error.message
            }, {
                status: 401
            });
        }

        return NextResponse.json<WishlistResponse<never>>({
            statusCode: 500,
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
