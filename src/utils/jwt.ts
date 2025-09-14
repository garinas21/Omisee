import * as jose from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key"

export const createToken = async (payload: jose.JWTPayload) => {
    const secret = new TextEncoder().encode(SECRET_KEY);
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(secret);
}

export const readPayload = async <Payload>(token: string) => {
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    const payloadJose = await jose.jwtVerify<Payload>(token, secretKey);

    return payloadJose.payload
}
