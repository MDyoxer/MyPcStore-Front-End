import { buildApiUrl } from "@/src/utils/baseApiUrl";
import { Client } from "./register-client";
//TODO: no mandar idtoken como parametro same in registerClient
export async function LoginClient(idToken:string):Promise<Client>{
        const response = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken }),
        cache: "no-store"
    });
    
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return (await response.json()) as Client;
}