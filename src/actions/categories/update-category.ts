import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function updateCategory(idToken: string, id: number, categoria: string) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl(`/categories/${id}`), {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoria }),
    });
    if (!response.ok) {
        throw new Error("Error al actualizar la categoría.");
    }
    return await response.json();
}
