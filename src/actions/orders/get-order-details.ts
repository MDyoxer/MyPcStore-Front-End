import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type orderDetailsItems = {
    idOrden: number,
    cantidad: number,
    precioGuardado: number,
    idProducto: number,
    producto:string,
    imgProducto:string,
}

export async function GetOrderUserItems(idToken: string, idOrden:number): Promise<orderDetailsItems[]> {
    const reponse = await fetch(buildApiUrl(`/orders/${idOrden}`), {
        method: "GET",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!reponse.ok) {
        throw new Error("Failed to fetch user orders products");
    }
    const data = (await reponse.json()) as orderDetailsItems[];
    if (!Array.isArray(data)) {
        throw new Error("The response for user orders is invalid.");
    }
    return data;
}