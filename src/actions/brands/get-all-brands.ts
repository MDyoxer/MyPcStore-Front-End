//Get all brands from the api and return them as a list of Product objects used on Products.tsx
"use client"
import { buildApiUrl } from "@/src/utils/baseApiUrl"
export type Brands = {
    id: number,
    marca: string,

}

export async function GetBrands(): Promise<Brands[]> {
    const response = await fetch(buildApiUrl("/brands/allBrands"), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as Brands[];
    if (!Array.isArray(data)) {
        throw new Error("La respuesta de productos es invalida.");
    }

    return data;
}