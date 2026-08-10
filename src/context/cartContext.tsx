"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { AddToCart } from "../actions/cart/add-to-cart";
import { GetUserCart } from "../actions/cart/get-user-cart";

type CartContextType = {
    count: number;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    sync: (count: number) => void;
    adjust: (delta: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, getIdToken } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        let active = true;
        (async () => {
            if (!user) {
                if (active) setCount(0);
                return;
            }
            const idToken = await getIdToken();
            if (!idToken) return;
            try {
                const items = await GetUserCart(idToken);
                if (active) {
                    setCount(items.reduce((acc, i) => acc + i.cantidad, 0));
                }
            } catch {
                // Manejo de error
            }
        })();
        return () => {
            active = false;
        };
    }, [user, getIdToken]);

    const addToCart = useCallback(
        async (productId: number, quantity: number) => {
            setCount((c) => c + quantity);
            const idToken = await getIdToken();
            if (!idToken) {
                setCount((c) => Math.max(0, c - quantity));
                return;
            }
            try {
                await AddToCart(idToken, { idProducto: productId, cantidad: quantity });
            } catch {
                setCount((c) => Math.max(0, c - quantity));
            }
        },
        [getIdToken]
    );

    const sync = useCallback((n: number) => setCount(n), []);
    const adjust = useCallback(
        (delta: number) => setCount((c) => Math.max(0, c + delta)),
        []
    );
    const clear = useCallback(() => setCount(0), []);

    return (
        <CartContext.Provider value={{ count, addToCart, sync, adjust, clear }}>
            {children}
        </CartContext.Provider>
    );
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de <CartProvider>");
    }
    return context;
}