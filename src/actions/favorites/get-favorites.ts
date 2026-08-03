import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type favItems = {
    idProd: number,
    nombre: string,
    precio: number,
    imagen: string,
    categoria: string,
    marca: string,
    agregado:string,
}

export async function GetFavItems(idToken: string): Promise<favItems[]> {
    const reponse = await fetch(buildApiUrl("/favorites/getFavorites"), {
        method: "GET",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!reponse.ok) {
        throw new Error("Failed to fetch user favorites products");
    }
    const data = (await reponse.json()) as favItems[];
    if (!Array.isArray(data)) {
        throw new Error("The response for user favorites is invalid.");
    }
    return data;
}