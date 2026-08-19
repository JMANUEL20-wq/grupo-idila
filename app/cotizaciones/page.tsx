"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Cotizacion } from "@/types";
import AppShell from "@/components/AppShell";

const BADGE: Record<string, string> = {
  Borrador: "idila-badge-borrador",
  Enviada: "idila-badge-enviada",
  Aceptada: "idila-badge-aceptada",
  Rechazada: "idila-badge-rechazada",
};

export default function CotizacionesPage() {
  const { profile, loading, logout } = useProfile("admin");
  const [items, setItems] = useState<Cotizacion[]>([]);

  useEffect(() => {
    if (!profile || !supabase) return;
    supabase.from("cotizaciones").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, [profile]);

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <p className="idila-label mb-1">Área administrativa</p>
          <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Cotizaciones</h1>
        </div>
        <Link href="/cotizaciones/nueva" className="idila-button">Nueva cotización</Link>
      </div>

      <div className="idila-card overflow-hidden">
        <table className="idila-table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td className="font-semibold">{c.nombre}</td>
                <td>{c.cliente}</td>
                <td>${Number(c.total).toLocaleString("es-MX")}</td>
                <td><span className={`idila-badge ${BADGE[c.estado]}`}>{c.estado}</span></td>
                <td><Link href={`/cotizaciones/${c.id}`} className="text-[var(--idila-primary)] font-semibold text-sm">Ver →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <p className="text-gray-500 p-6">Aún no hay cotizaciones.</p>}
      </div>
    </AppShell>
  );
}
