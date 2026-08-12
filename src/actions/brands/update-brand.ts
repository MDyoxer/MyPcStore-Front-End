import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function updateBrand(idToken: string, id: number, marca: string) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl(`/brands/${id}`), {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ marca }),
    });
    if (!response.ok) {
        throw new Error("Error al actualizar la marca.");
    }
    return await response.json();
}
