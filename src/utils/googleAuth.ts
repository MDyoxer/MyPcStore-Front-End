import { signInWithPopup, type AuthError, type AuthCredential } from "firebase/auth";
import { googleProvider, auth } from "@/src/lib/firebase/config";
import { RegisterClient } from "@/src/actions/client/register-client";
import { LoginClient } from "@/src/actions/client/login-client";

export type GoogleSignInError = {
    code: "account-exists-with-different-credential" | "unknown";
    email: string | null;
    credential: AuthCredential | null;
};

export type GoogleSignInResult = {
    user: import("firebase/auth").User | null;
    error: GoogleSignInError | null;
};
//Sign in and register via Google account then call login or registrer action
export const handleGoogleSignIn = async (): Promise<GoogleSignInResult> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        try {
            const idToken = await result.user.getIdToken();
            try {
                //if user login fails then try to register
                await LoginClient(idToken);
            } catch {
                await RegisterClient(idToken, result.user.displayName ?? "Cliente");
            }
        } catch (backendError) {
            console.error("Error al sincronizar Google en el backend:", backendError);
        }
        return { user: result.user, error: null };
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        const authError = error as AuthError;
        if (authError.code === "auth/account-exists-with-different-credential") {
            const accountExistsError = error as AuthError & {
                email?: string;
                credential?: AuthCredential | null;
            };
            return {
                user: null,
                error: {
                    code: "account-exists-with-different-credential",
                    email: accountExistsError.email ?? null,
                    credential: accountExistsError.credential ?? null,
                },
            };
        }
        return {
            user: null,
            error: { code: "unknown", email: null, credential: null },
        };
    }
};
