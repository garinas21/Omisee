
export const GET = async () => {

    return Response.json(
        {
            statusCode: 200,
            message: "Welcome to API Omisee"
        },
        {
            status: 200,
        }
    )
}