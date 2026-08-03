//Get information about one product from the api and return it as a Product object used on ProductDetails.tsx
"use client"
import { buildApiUrl } from "@/src/utils/baseApiUrl"
export type Product = {
    id: number,
    categoria: string,
    marca: string,
    nombre: string,
    precio: number,
    imagen: string,
    descripcion: string,
    stock:number,
}

export async function GetOneProduct(id: number): Promise<Product> {
    const response = await fetch(buildApiUrl(`/products/product/${id}`), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    const data = (await response.json()) as Product;
    if (!data) {
        throw new Error("La respuesta de producto es invalida.");
    }

    return data;
}

