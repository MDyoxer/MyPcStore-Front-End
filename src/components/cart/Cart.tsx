export default function Cart(){
    return(
        <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Carrito de compras</h1>
            
            <p className="text-zinc-700 dark:text-zinc-300">Tu carrito está vacío.</p>
        </div>
    )
}