import { getProduct } from "@/db/model/productModel";

export const GET = async () => {
    const data = await getProduct()

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