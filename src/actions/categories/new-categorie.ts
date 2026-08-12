import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function createCategory(idToken: string, categoria: string) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl("/categories/newCat"), {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoria }),
    });
    if (!response.ok) {
        throw new Error("Error al crear la categoría.");
    }
    return await response.json();
}
