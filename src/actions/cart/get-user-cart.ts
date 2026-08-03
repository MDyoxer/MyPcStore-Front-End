import { buildApiUrl } from "@/src/utils/baseApiUrl";
export type cartItems={
    id:number,
    idProducto:number,
    cantidad:number,
    nombre:string,
    precio:number,
    imagen:string,
}
export async function GetUserCart(idToken: string): Promise<cartItems[]> {
    const reponse = await fetch(buildApiUrl("/cart/userCart"), {
        method: "GET",
        cache: "no-store",
        headers: {
            "Authorization": `Bearer ${idToken}`,
        },
    });
    if(!reponse.ok){
        throw new Error("Failed to fetch user cart");
    }
    const data = (await reponse.json()) as cartItems[];
    if(!Array.isArray(data)){
        throw new Error("La respuesta del carrito es invalida.");
    }
    return data;
}