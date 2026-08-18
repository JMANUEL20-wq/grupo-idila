 "use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, Proyecto } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/login");
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const { data: pr } = await supabase.from("proyectos").select("*").order("created_at", { ascending: false });
      setProfile(p);
      setProjects(pr ?? []);
      setLoading(false);
    })();
  }, [router]);

  async function logout() {
    await supabase?.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <main className="p-8">Cargando...</main>;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xl font-black text-[#1F4D3D]">GRUPO IDILA</p>
          <p className="text-sm text-[#6B8F7B] font-semibold">Gestión Industrial</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">{profile?.nombre}</span>
          <button onClick={logout} className="rounded-lg border px-3 py-2 text-sm">Salir</button>
        </div>
      </header>

      <section className="mb-8">
        <h1 className="text-3xl font-black">Hola, {profile?.nombre || "usuario"}</h1>
        <p className="text-gray-500 mt-1">Control central de tu operación.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="En proceso" value={projects.filter(p=>p.estado==="En proceso").length} />
        <Stat label="Terminados" value={projects.filter(p=>p.estado==="Terminado").length} />
        <Stat label="Entregados" value={projects.filter(p=>p.estado==="Entregado").length} />
        <Stat label="Total" value={projects.length} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/proyectos/nuevo" className="idila-card p-6 hover:shadow-lg"><b>Nuevo proyecto</b><p className="text-sm text-gray-500 mt-1">Registrar un trabajo.</p></Link>
        <Link href="/proyectos" className="idila-card p-6 hover:shadow-lg"><b>Proyectos</b><p className="text-sm text-gray-500 mt-1">Consultar proyectos.</p></Link>
        {profile?.role === "admin" && <Link href="/finanzas" className="idila-card p-6 hover:shadow-lg"><b>Finanzas</b><p className="text-sm text-gray-500 mt-1">Información privada.</p></Link>}
      </div>

      <section className="idila-card p-6">
        <h2 className="text-xl font-bold mb-4">Proyectos recientes</h2>
        <div className="space-y-3">
          {projects.slice(0,5).map(p => <Link key={p.id} href={`/proyectos/${p.id}`} className="block rounded-xl border p-4 hover:bg-gray-50"><div className="flex justify-between gap-4"><b>{p.nombre}</b><span className="text-sm text-[#1F4D3D]">{p.estado}</span></div><p className="text-sm text-gray-500">{p.cliente}</p></Link>)}
          {!projects.length && <p className="text-gray-500">Aún no hay proyectos.</p>}
        </div>
      </section>
    </main>
  );
}
function Stat({label,value}:{label:string,value:number}) {
  return <div className="idila-card p-5"><p className="text-sm text-gray-500">{label}</p><p className="text-3xl font-black mt-2 text-[#1F4D3D]">{value}</p></div>;
}