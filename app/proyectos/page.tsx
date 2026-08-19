"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Proyecto } from "@/types";
import AppShell from "@/components/AppShell";

export default function ProyectosPage() {
  const { profile, loading, logout } = useProfile();
  const [items, setItems] = useState<Proyecto[]>([]);

  useEffect(() => {
    if (!profile || !supabase) return;
    supabase.from("proyectos").select("*").eq("estado", "En proceso").order("created_at", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, [profile]);

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <p className="idila-label mb-1">Trabajos activos</p>
          <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Proyectos</h1>
        </div>
        <Link href="/proyectos/nuevo" className="idila-button">+ Nuevo proyecto</Link>
      </div>

      <div className="idila-card overflow-hidden">
        <table className="idila-table">
          <thead>
            <tr><th>Proyecto</th><th>Cliente / Empresa</th><th>Material</th><th>Entrega estimada</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = `/proyectos/${p.id}`)}>
                <td className="font-semibold">{p.nombre}</td>
                <td>{p.cliente}{p.empresa ? ` — ${p.empresa}` : ""}</td>
                <td>{p.material || "—"}</td>
                <td style={{ fontFamily: "var(--font-mono-idila)" }}>{p.fecha_entrega || "—"}</td>
                <td><span className="idila-badge idila-badge-proceso">{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <div className="p-8 text-gray-500">No hay proyectos en proceso. Los que termines aparecerán en Archivos.</div>}
      </div>
    </AppShell>
  );
}
