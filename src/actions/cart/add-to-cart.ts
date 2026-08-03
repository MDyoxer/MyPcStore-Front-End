import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type cartAddedItem = {
    idProducto: number,
    cantidad: number,
}

export async function AddToCart(idToken: string, cartItems: cartAddedItem): Promise<cartAddedItem> {
    const response = await fetch(buildApiUrl("/cart/addToCart"), {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(cartItems),
    });
    if (!response.ok) {
        throw new Error("Failed to add items to cart");
    }
    return await response.json();
}