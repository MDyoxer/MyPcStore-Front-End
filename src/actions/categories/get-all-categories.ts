//Get all categories from the api and return them as a list of Brand objects used on Products.tsx
"use client"
import { buildApiUrl } from "@/src/utils/baseApiUrl"
export type Categories = {
    id: number,
    categoria: string,
    slug: string,
}

export async function GetCategories(): Promise<Categories[]> {
    const response = await fetch(buildApiUrl("/categories/allCategories"), {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as Categories[];
    if (!Array.isArray(data)) {
        throw new Error("La respuesta de productos es invalida.");
    }

    return data;
}