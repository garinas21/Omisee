import LoginClient from "@/component/LoginPage/LoginClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-neutral-500">Loading…</div>}
    >
      <LoginClient />
    </Suspense>
  );
}
