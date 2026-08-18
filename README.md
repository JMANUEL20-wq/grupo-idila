# GRUPO IDILA — Gestión Industrial

Sistema privado de gestión para taller.

## Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase

## 1. Instalar
```bash
npm install
```

## 2. Configurar Supabase
Copia `.env.example` como `.env.local` y coloca:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Base de datos
En Supabase > SQL Editor, ejecuta `supabase/schema.sql`.

## 4. Crear usuario
Crea el usuario desde Supabase Authentication. El trigger crea automáticamente su perfil. Luego cambia su rol a `admin` usando el SQL indicado al final de `schema.sql`.

## 5. Ejecutar
```bash
npm run dev
```

La aplicación no depende de logos ni imágenes externas. La identidad se presenta con texto y CSS para evitar recursos rotos.

## Flujo previsto
Login → Dashboard → Proyectos → Ficha → Archivos.
El módulo Finanzas y las cotizaciones quedan protegidos para administradores.
