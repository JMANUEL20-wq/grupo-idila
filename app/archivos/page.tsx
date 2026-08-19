"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Proyecto } from "@/types";
import AppShell from "@/components/AppShell";

export default function ArchivosPage() {
  const { profile, loading, logout } = useProfile();
  const [items, setItems] = useState<Proyecto[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "Terminado" | "Entregado">("todos");

  useEffect(() => {
    if (!profile || !supabase) return;
    supabase.from("proyectos").select("*").in("estado", ["Terminado", "Entregado"]).order("created_at", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, [profile]);

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  const visibles = filtro === "todos" ? items : items.filter(p => p.estado === filtro);

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="mb-6">
        <p className="idila-label mb-1">Historial</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Archivos</h1>
        <p className="text-gray-500 mt-1">Proyectos terminados y entregados.</p>
      </div>

      <div className="flex gap-2 mb-4">
        {(["todos", "Terminado", "Entregado"] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`idila-button-ghost text-sm ${filtro === f ? "!bg-[var(--idila-bg)]" : ""}`}>{f === "todos" ? "Todos" : f}</button>
        ))}
      </div>

      <div className="idila-card overflow-hidden">
        <table className="idila-table">
          <thead><tr><th>Proyecto</th><th>Cliente / Empresa</th><th>Entregado</th><th>Estado</th></tr></thead>
          <tbody>
            {visibles.map(p => (
              <tr key={p.id} className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = `/proyectos/${p.id}`)}>
                <td className="font-semibold">{p.nombre}</td>
                <td>{p.cliente}{p.empresa ? ` — ${p.empresa}` : ""}</td>
                <td style={{ fontFamily: "var(--font-mono-idila)" }}>{p.fecha_entrega || "—"}</td>
                <td><span className={`idila-badge ${p.estado === "Terminado" ? "idila-badge-terminado" : "idila-badge-entregado"}`}>{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visibles.length && <div className="p-8 text-gray-500">Aún no hay proyectos aquí.</div>}
      </div>
    </AppShell>
  );
}
