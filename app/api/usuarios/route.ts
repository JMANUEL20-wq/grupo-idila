import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Todas las rutas verifican que quien llama sea un admin autenticado,
// usando el token del usuario que llega en el header Authorization.
async function getCallerRole(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!token || !supabaseAdmin) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role ?? null;
}

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  const role = await getCallerRole(req);
  if (role !== "admin") return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { data, error } = await supabaseAdmin.from("profiles").select("*").order("nombre");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ usuarios: data });
}

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  const role = await getCallerRole(req);
  if (role !== "admin") return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { email, password, nombre, rol } = await req.json();
  if (!email || !password || !nombre || !rol) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, role: rol },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // El trigger de la base de datos crea el perfil automáticamente;
  // nos aseguramos de que el rol quede como se indicó.
  await supabaseAdmin.from("profiles").update({ role: rol, nombre }).eq("id", data.user.id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  const role = await getCallerRole(req);
  if (role !== "admin") return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Falta el id." }, { status: 400 });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
