import { buildApiUrl } from "@/src/utils/baseApiUrl";

export async function createBrand(idToken: string, marca: string) {
    if (!idToken) throw new Error("No se proporcionó un token de autenticación.");
    const response = await fetch(buildApiUrl("/brands/newBrand"), {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ marca }),
    });
    if (!response.ok) {
        throw new Error("Error al crear la marca.");
    }
    return await response.json();
}
