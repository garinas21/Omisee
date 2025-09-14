import { NextRequest, NextResponse } from "next/server";
import { readPayload } from "./utils/jwt";
import { cookies } from "next/headers";

type UserJWT = { id: string };

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/wishlist") {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        const accesToken = token?.value

        if (!accesToken) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("error", "unauthorized");
            url.searchParams.set("redirectTo", "/wishlist");
            return NextResponse.redirect(url);
        }


        const tokenData = await readPayload<UserJWT>(token.value);

        const headers = new Headers(request.headers);
        headers.set("x-user-id", tokenData.id);
        return NextResponse.next({ request: { headers } });

    }

    if (pathname.startsWith("/api/wishlist")) {
        if (request.method === "OPTIONS") {
            return NextResponse.next();
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        const accesToken = token?.value

        if (!accesToken) {
            return NextResponse.json(
                { statusCode: 401, error: "Unauthorized: No token" },
                { status: 401 }
            );
        }

        try {
            const user = await readPayload<UserJWT>(accesToken);
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("x-user-id", user.id);
            return NextResponse.next({ request: { headers: requestHeaders } });
        } catch {
            return NextResponse.json(
                { statusCode: 401, error: "Unauthorized: Invalid token" },
                { status: 401 }
            );
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/wishlist", "/api/wishlist/:path*"],
};
