import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type checkoutResponse = {
    clientSecret: string,
    paymentIntentId: string,
    orderId: number,
    amount: number,
    currency: string,
}

export async function CreateCheckout(idToken:string): Promise<checkoutResponse> {
    const response = await fetch(buildApiUrl("/stripe/checkout"), {
        method: "POST",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to create checkout session");
    }
    return response.json();
}