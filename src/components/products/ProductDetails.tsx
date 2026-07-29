"use client";
import { GetOneProduct, Product } from "@/src/actions/products/get-one-product";
import { useState, useEffect } from "react";
export default function ProductDetails({ id }: { id: number }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const load = async () => {
            const data = await GetOneProduct(id);
            setProduct(data);
            setTimeout(() => setLoaded(true), 80)
        }
        load()
    }, []);

    return (
        <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Detalles del producto</h1>
            <p className="text-zinc-700 dark:text-zinc-300">Aquí se mostrarán los detalles del producto seleccionado.</p>
            <h1>{product?.nombre}</h1>
            <h3>{product?.precio}</h3>
            <h3>{product?.descripcion}</h3>
            <h3>{product?.stock}</h3>
            <button>Comprar</button>
            <button>Agregar al carrito</button>
        </div>
    );
}