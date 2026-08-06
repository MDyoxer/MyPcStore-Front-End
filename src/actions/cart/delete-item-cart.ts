import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function DeleteItemCart(idToken:string, idCart:number): Promise<void>{
    const response = await fetch(buildApiUrl(`/cart/removeItem/${idCart}`), {
        method: "DELETE",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete item from cart");

    }
}