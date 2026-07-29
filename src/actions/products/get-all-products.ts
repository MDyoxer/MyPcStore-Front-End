//Get all products from the api and return them as a list of Product objects used on TopProducts.tsx
"use client"
import { buildApiUrl } from "@/src/utils/BaseApiUrl"
export type Products = {
    id: number,
    categoria: string,
    marca: string,
    nombre: string,
    precio: number,
    imagen: string,
}


export async function GetProducts(): Promise<Products[]> {
    const response = await fetch(buildApiUrl("/products/findAllProducts"), {
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