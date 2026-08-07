import { useCallback } from "react";
import { AddFavoriteItem } from "../actions/favorites/add-favorite";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";

type UseProductActionParams = {
    onConfirmCart?: (id: number) => void;
    getQuantity?: (id: number) => number;
};

export function useProductAction({ onConfirmCart, getQuantity }: UseProductActionParams = {}) {
    const { getIdToken } = useAuth();
    const { addToCart } = useCart();
    //add a item to favorite section
    const handleFavoriteItem = useCallback(async (idProducto: number) => {
        const idToken = await getIdToken();
        if (!idToken) return;

        try {
            await AddFavoriteItem(idToken, { idProducto });
        } catch (error) {
            console.error("Error al agregar a favoritos:", error);
        }
    }, [getIdToken]);
    //add a item to cart section
    const handleAddToCart = useCallback(async (idProducto: number, cantidad: number) => {
        await addToCart(idProducto, cantidad);
    }, [addToCart]);

    //confirm and add a item to cart section
    const confirmAndAdd = useCallback((id: number) => {
        onConfirmCart?.(id);
        handleAddToCart(id, getQuantity?.(id) ?? 1);
    }, [getQuantity, handleAddToCart, onConfirmCart]);

    return {
        handleFavoriteItem,
        handleAddToCart,
        confirmAndAdd,
    };
}
