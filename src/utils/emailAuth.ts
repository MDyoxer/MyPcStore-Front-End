import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    linkWithCredential,
    type AuthError,
    type AuthCredential,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase/config';
import { RegisterClient } from '../actions/client/register-client';
import { LoginClient } from '../actions/client/login-client';

//ERRORS FOR AUTHENTICATION
const AUTH_ERRORS_MESSAGES: Record<string, string> = {
    "auth/email-already-in-use": "Este correo ya está registrado",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
    "auth/invalid-email": "El correo no es válido",
    "auth/invalid-credential": "Correo o contraseña incorrectos",
    "auth/user-not-found": "No existe una cuenta con este correo",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/too-many-requests": "Demasiados intentos, intenta más tarde",
    "auth/network-request-failed": "Error de red, verifica tu conexión",
}

const getErrorMessage = (error: unknown): string => {
    const code = (error as AuthError)?.code;
    return AUTH_ERRORS_MESSAGES[code] || "Ocurrió un error, intenta nuevamente";
}
//Sign up  via email and pass
export const handleSignUp = async (email: string, password: string, nombre: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: nombre });
        try {
            const idToken = await userCredential.user.getIdToken();
            await RegisterClient(idToken, nombre);
        } catch (backendError) {
            console.error("Error al sincronizar registro en el backend:", backendError);
        }
        return { user: userCredential.user, error: null };
    } catch (error) {
        console.error("Error al registrarse", error);
        return { user: null, error: getErrorMessage(error) };
    }
};

//Login via email and pass
export const handleLogin = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        try {
            const idToken = await userCredential.user.getIdToken();
            await LoginClient(idToken);
        } catch (backendError) {
            console.error("Error al sincronizar login en el backend:", backendError);
        }
        return { user: userCredential.user, error: null };
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        return { user: null, error: getErrorMessage(error) };
    }
};
//link google account with an already registered email and password 
export const linkGoogleWithEmailPassword = async (email: string, password: string, googleCredential: AuthCredential) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const linkedCredential = await linkWithCredential(userCredential.user, googleCredential);
        return { user: linkedCredential.user, error: null };
    } catch (error) {
        console.error("Error al vincular cuenta de Google", error);
        return { user: null, error: getErrorMessage(error) };
    }
};