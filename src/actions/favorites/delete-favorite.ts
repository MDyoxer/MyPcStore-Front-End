import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function DeleteFavorite(idToken: string, idProd: number): Promise<void> {
    const response = await fetch(buildApiUrl(`/favorites/unfavorite/${idProd}`), {
        method: "PATCH",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete favorite");
    }
}