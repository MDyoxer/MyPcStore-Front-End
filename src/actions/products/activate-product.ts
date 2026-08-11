import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function ActivateProduct(idToken: string, idProduct: number) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl(`/products/activate/${idProduct}`), {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Error al activar el producto.");
    }
    return await response.json();
}