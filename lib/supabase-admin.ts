import { createClient } from "@supabase/supabase-js";

// Cliente de servidor únicamente. Usa la service_role key, que NUNCA debe
// exponerse al navegador (por eso no lleva el prefijo NEXT_PUBLIC_).
// Solo se usa dentro de app/api/**/route.ts (código de servidor).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;
