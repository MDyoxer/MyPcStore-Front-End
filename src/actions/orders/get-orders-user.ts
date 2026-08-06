import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type orderItems = {
    idOrden: number,
    fechaOrden: string,
    total: number,
    pagado:boolean,
    statusEnvio?: string,
}

export async function GetOrderUserItems(idToken: string): Promise<orderItems[]> {
    const reponse = await fetch(buildApiUrl("/orders"), {
        method: "GET",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if (!reponse.ok) {
        throw new Error("Failed to fetch user orders products");
    }
    const data = (await reponse.json()) as orderItems[];
    if (!Array.isArray(data)) {
        throw new Error("The response for user orders is invalid.");
    }
    return data;
}