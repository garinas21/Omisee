import { getProductBySlug } from "@/db/model/productModel";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> },) => {
    const { slug } = await params;

    const data = await getProductBySlug(slug)

    return Response.json(
        {
            statusCode: 200,
            data: data,
        },
        {
            status: 200,
        }
    )
}