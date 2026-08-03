import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type favAddedItem = {
    idProducto: number,
}

export async function AddFavoriteItem(idToken: string, favItems: favAddedItem): Promise<favAddedItem> {
    const response = await fetch(buildApiUrl("/favorites/addFavorite"), {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(favItems),
    });
    if (!response.ok) {
        throw new Error("Failed to add favorite item");
    }
    return await response.json();
}