import Image from "next/image";

export default function Banner(){
    return(
        <div className="relative w-full h-auto">
            <Image src="/ryzen9800.png" alt="Banner" width={669} height={373} className="w-full h-auto object-cover" />
        </div>
    )
}
