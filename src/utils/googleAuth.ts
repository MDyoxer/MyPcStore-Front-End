import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "@/src/lib/firebase/config";

export const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            //TODO: send to backend Results 
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
        }
    }