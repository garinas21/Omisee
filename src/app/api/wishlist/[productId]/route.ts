import { deleteWishlist } from "@/db/model/wishlistModel";
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

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) => {
    try {

        const userId = request.headers.get('x-user-id');
        const { productId } = await params;

        const parsedInput = wishlistInputSchema.safeParse({
            userId,
            productId
        });

        if (!parsedInput.success) {
            throw parsedInput.error;
        }

        const deleted = await deleteWishlist(parsedInput.data.userId, parsedInput.data.productId);

        if (!deleted) {
            throw new Error('Wishlist item not found');
        }

        return NextResponse.json<WishlistResponse<unknown>>({
            statusCode: 200,
            message: 'Product removed from wishlist successfully'
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json<WishlistResponse<never>>({
                statusCode: 400,
                error: error.issues[0].message
            }, { status: 400 });
        }

        if (error instanceof Error && error.message === 'Wishlist item not found') {
            return NextResponse.json<WishlistResponse<never>>({
                statusCode: 404,
                error: error.message
            }, { status: 404 });
        }

        return NextResponse.json<WishlistResponse<never>>({
            statusCode: 500,
            error: 'Internal Server Error'
        }, { status: 500 });
    }
};
