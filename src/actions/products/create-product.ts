import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function createProduct(idToken: string, data: FormData) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl("/products/newProduct"), {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
        body: data,
    });
    if (!response.ok) {
        throw new Error("Error al crear el producto.");
    }
    return await response.json();
}