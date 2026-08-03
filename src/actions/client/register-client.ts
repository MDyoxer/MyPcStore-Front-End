import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type Client = {
    id:number;
    nombre:string;
    correo:string;
    firebaseId:string;
}

export async function RegisterClient(idToken:string, nombre:string):Promise<Client>{
        const response = await fetch(buildApiUrl("/auth/register"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken, nombre }),
        cache: "no-store"
    });
    
    if (!response.ok) {
        throw new Error('Failed to register client');
    }
    return (await response.json()) as Client;
}