# MyPcStore Front-End

E-commerce de productos de cómputo (laptops, equipos, hardware, software). Diseño estilizado con colores oscuros, morados y amarillos, estilo futurista.

Stack: Next.js 16 + Tailwind CSS v4 + Lucide Icons + Firebase.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Fuentes De Verdad
- `README.md` es el template de `create-next-app`; si contradice `package.json`, configs o `src`, confía en el código/configuración.
- `AGENTS.md` es siempre la fuente más actualizada de convenciones del proyecto.

## Comandos
- Instalar: `npm install`.
- Desarrollo: `npm run dev`.
- Build completo: `npm run build`.
- Lint: `npm run lint` (ESLint v9 flat config). Para lint enfocado: `npm exec eslint -- src/ruta/archivo.tsx`.
- No hay test runner ni archivos `*.test`/`*.spec`; no inventes `npm test`.

## Arquitectura
- Next.js 16 App Router; rutas en `src/app`, alias `@/*` apunta a la raíz del proyecto.
- Estructura modular: `actions/` (server actions), `components/` (UI), `utils/` (helpers), `lib/` (servicios externos), `context/` (estado global), `hooks/` (custom hooks).
- `src/app/layout.tsx` es el root layout; renderiza `<Navbar />` globalmente. El footer se coloca por página.
- No hay `middleware.ts` de protección server-side.

## Diseño y Estilos
- Tailwind CSS v4 configurado en `src/app/globals.css` con `@import "tailwindcss"` y `@theme inline`. No hay `tailwind.config.*`.
- **Paleta**: fondos oscuros (`bg-black`, `bg-zinc-900`), acento morado (`purple-500`, `purple-400`), acento amarillo neón (`#c8ff00`), texto en escala de zinc (`zinc-300`, `zinc-400`, `zinc-500`).
- **Fuentes**: `Bebas_Neue` para headings (`--font-bebas-neue`), `Inter` para body (`font-sans`). Las fuentes se cargan en `layout.tsx` vía `next/font/google`.
- **Iconos**: `lucide-react` para todos los iconos. No uses emojis ni SVGs inline salvo que sea estrictamente necesario.
- **Animaciones**: transiciones suaves con `transition-all duration-300`, efectos hover con `-translate-y-1` y sombras glow. Sin saturar. Preferir `transition` de Tailwind sobre keyframes personalizados.
- **Componentes**: bordes redondeados con `rounded-xl` o `rounded-2xl`, fondos semitransparentes con `bg-zinc-900/70` o `bg-zinc-800/80`, bordes `border-zinc-800`.
- Para estilos únicos usa `className` de Tailwind directamente; no escribas CSS personalizado salvo en `globals.css`.

## API y Backend
- `src/utils/baseApiUrl.ts` exporta `getApiBaseUrl()` (lee `NEXT_PUBLIC_MY_PC_STORE_API_BASE_URL`, default `http://localhost:3003`) y `buildApiUrl(path)` para construir URLs.
- Las actions en `src/actions/` deben importar `buildApiUrl` para llamar al backend.
- `src/actions/products/get-all-products.ts` contiene el tipo `Product` (`id`, `categoria`, `marca`, `nombre`, `precio`, `imagen`) y `GetProducts()`.

## Firebase
- Config en `src/lib/firebase/config.ts` con credenciales hardcodeadas.
- Inicializa `app` y `analytics`. No hay Auth, Firestore ni otros servicios configurados aún.
- Las variables de entorno comienzan con `NEXT_PUBLIC_` (ej. `NEXT_PUBLIC_MY_PC_STORE_API_BASE_URL`).
- `.env` está ignorado por git; documenta variables ahí.

## Estructura de Carpetas
```
src/
├── actions/       # Server actions para llamadas API (modular por entidad)
├── app/           # App Router pages y layouts
├── components/    # Componentes UI (modular por feature: home/, layout/)
├── context/       # Context providers (vacío)
├── hooks/         # Custom hooks (vacío)
├── lib/           # Servicios externos (firebase/config)
└── utils/         # Funciones reutilizables (baseApiUrl, formatMoney)
```

## Convenciones de Código
- **Modularización**: Cada feature en su propia carpeta. Componentes grandes dividirlos en subcomponentes.
- **Server Actions**: Colocar en `src/actions/<entidad>/`. Usar `"use client"` o `"use server"` según corresponda.
- **Funciones reutilizables**: Si una función puede usarse en múltiples módulos, va en `src/utils/`.
- **Formateo de moneda**: Usar `formatMoney` de `src/utils/formatMoney.ts` que formatea en MXN.
- **Tipado**: No usar `any` sin justificarlo. Definir tipos en el archivo de action correspondiente o en `src/types/` si se comparten.
- **Imágenes**: Usar `next/image` con `remotePatterns` configurado en `next.config.ts` para Firebase Storage. Para imágenes locales, usar la carpeta `public/`.
- **Rutas vacías**: Las páginas scaffolded sin implementar deben dejarse vacías o con placeholder text.

## No Hagas
- No instalar dependencias sin avisar.
- No subir archivos `.env*` al repositorio.
- No usar `any` en TypeScript sin justificarlo.
- No crear documentación adicional (README, MD) salvo que se solicite explícitamente.

## Flujo de Trabajo
- Antes de una tarea no trivial, propón un plan y espera el OK.
- Una tarea a la vez; al terminar, reporta qué cambiaste.
- Si no estás seguro al 80%, pregunta. No inventes.
- Sigue las mejores prácticas: componentes modulares, tipado fuerte, código limpio.
