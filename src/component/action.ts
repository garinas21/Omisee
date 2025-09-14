"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/login");
};

export const dologin = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    return Boolean(token);
}