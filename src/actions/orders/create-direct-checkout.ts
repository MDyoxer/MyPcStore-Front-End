import { buildApiUrl } from "@/src/utils/baseApiUrl";
import type { checkoutResponse } from "./create-checkout";

export async function CreateDirectCheckout(
    idToken: string,
    productId: number,
    quantity: number
): Promise<checkoutResponse> {
    const response = await fetch(buildApiUrl("/stripe/direct-checkout"), {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
        throw new Error("Failed to create direct checkout session");
    }
    return response.json();
}