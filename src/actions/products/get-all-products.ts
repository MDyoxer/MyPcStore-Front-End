//Get all products from the api and return them as a list of Product objects 
"use client"
import { buildApiUrl } from "@/src/utils/baseApiUrl"
export type Products = {
    id: number,
    categoria: string,
    marca: string,
    nombre: string,
    precio: number,
    imagen: string,
    stock: number,
    activo: number,
}


export async function GetProducts(): Promise<Products[]> {
    const response = await fetch(buildApiUrl("/products/findAllProductsAdmin"), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as Products[];
    if (!Array.isArray(data)) {
        throw new Error("La respuesta de productos es invalida.");
    }

    return data;
}