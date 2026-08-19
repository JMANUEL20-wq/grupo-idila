"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Proyecto, Movimiento, Cotizacion } from "@/types";
import AppShell from "@/components/AppShell";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

export default function DashboardPage() {
  const { profile, loading, logout } = useProfile();
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [movs, setMovs] = useState<Movimiento[]>([]);
  const [cots, setCots] = useState<Cotizacion[]>([]);
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!profile || !supabase) return;
    (async () => {
      const { data: pr } = await supabase!.from("proyectos").select("*").order("created_at", { ascending: false });
      setProjects(pr ?? []);
      if (isAdmin) {
        const { data: mv } = await supabase!.from("finanzas").select("*").gte("created_at", startOfMonth());
        setMovs(mv ?? []);
        const { data: co } = await supabase!.from("cotizaciones").select("*").in("estado", ["Borrador", "Enviada"]).order("created_at", { ascending: false });
        setCots(co ?? []);
      }
    })();
  }, [profile, isAdmin]);

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  const nuevosMes = projects.filter(p => p.created_at >= startOfMonth()).length;
  const terminadosMes = projects.filter(p => p.estado !== "En proceso" && p.created_at >= startOfMonth()).length;
  const enProceso = projects.filter(p => p.estado === "En proceso");
  const ingresosMes = movs.filter(m => m.tipo === "ingreso").reduce((s, m) => s + Number(m.monto), 0);
  const gastosMes = movs.filter(m => m.tipo === "gasto").reduce((s, m) => s + Number(m.monto), 0);

  const proximasEntregas = [...enProceso]
    .filter(p => p.fecha_entrega)
    .sort((a, b) => (a.fecha_entrega! < b.fecha_entrega! ? -1 : 1))
    .slice(0, 5);

  const clientesFrecuentes = Object.entries(
    projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.cliente] = (acc[p.cliente] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const maxMonto = Math.max(ingresosMes, gastosMes, 1);

  return (
    <AppShell profile={profile} logout={logout}>
      <section className="mb-6">
        <p className="idila-label mb-1">Resumen · {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Hola, {profile.nombre || "usuario"}</h1>
      </section>

      <div className={`grid grid-cols-2 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-3"} gap-4 mb-6`}>
        <Stat label="Proyectos nuevos" value={nuevosMes} />
        <Stat label="En proceso" value={enProceso.length} />
        <Stat label="Terminados este mes" value={terminadosMes} />
        {isAdmin && <Stat label="Ingresos del mes" value={`$${ingresosMes.toLocaleString("es-MX")}`} accent />}
        {isAdmin && <Stat label="Gastos del mes" value={`$${gastosMes.toLocaleString("es-MX")}`} />}
      </div>

      <div className={`grid ${isAdmin ? "md:grid-cols-[1.3fr_1fr]" : ""} gap-4 mb-6`}>
        <div className="idila-card p-5">
          <p className="idila-section-label">Próximas entregas</p>
          <div className="space-y-1">
            {proximasEntregas.map(p => (
              <Link key={p.id} href={`/proyectos/${p.id}`} className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded" style={{ borderColor: "var(--idila-border)" }}>
                <div>
                  <b className="text-sm">{p.nombre}</b>
                  <p className="text-xs text-gray-500">{p.cliente}</p>
                </div>
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-mono-idila)", color: "var(--idila-primary)" }}>{p.fecha_entrega}</span>
              </Link>
            ))}
            {!proximasEntregas.length && <p className="text-sm text-gray-500 py-2">No hay fechas de entrega próximas registradas.</p>}
          </div>
        </div>

        {isAdmin && (
          <div className="idila-card p-5">
            <p className="idila-section-label">Ingresos vs. gastos del mes</p>
            <div className="flex items-end gap-4 h-24 mb-2">
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full rounded-t" style={{ height: `${(ingresosMes / maxMonto) * 100}%`, background: "var(--idila-brand)", minHeight: 4 }} />
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full rounded-t" style={{ height: `${(gastosMes / maxMonto) * 100}%`, background: "var(--idila-rust)", minHeight: 4 }} />
              </div>
            </div>
            <div className="flex justify-around text-xs text-gray-500">
              <span>Ingresos · ${ingresosMes.toLocaleString("es-MX")}</span>
              <span>Gastos · ${gastosMes.toLocaleString("es-MX")}</span>
            </div>
          </div>
        )}
      </div>

      <div className={`grid ${isAdmin ? "md:grid-cols-2" : ""} gap-4 mb-6`}>
        {isAdmin && (
          <div className="idila-card p-5">
            <p className="idila-section-label">Cotizaciones pendientes</p>
            <div className="space-y-1">
              {cots.slice(0, 5).map(c => (
                <Link key={c.id} href={`/cotizaciones/${c.id}`} className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded" style={{ borderColor: "var(--idila-border)" }}>
                  <div><b className="text-sm">{c.nombre}</b><p className="text-xs text-gray-500">{c.cliente}</p></div>
                  <b className="text-sm">${Number(c.total).toLocaleString("es-MX")}</b>
                </Link>
              ))}
              {!cots.length && <p className="text-sm text-gray-500 py-2">No hay cotizaciones pendientes.</p>}
            </div>
          </div>
        )}
        <div className="idila-card p-5">
          <p className="idila-section-label">Clientes frecuentes</p>
          <div className="space-y-1">
            {clientesFrecuentes.map(([nombre, count]) => (
              <div key={nombre} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--idila-border)" }}>
                <b className="text-sm">{nombre}</b>
                <span className="text-xs text-gray-500">{count} proyecto{count > 1 ? "s" : ""}</span>
              </div>
            ))}
            {!clientesFrecuentes.length && <p className="text-sm text-gray-500 py-2">Aún no hay proyectos registrados.</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Link href="/proyectos/nuevo" className="idila-card p-6 hover:shadow-lg block">
          <b>Nuevo proyecto</b>
          <p className="text-sm text-gray-500 mt-1">Registrar un trabajo.</p>
        </Link>
        <Link href="/proyectos" className="idila-card p-6 hover:shadow-lg block">
          <b>Proyectos</b>
          <p className="text-sm text-gray-500 mt-1">Ver trabajos en proceso.</p>
        </Link>
        <Link href="/archivos" className="idila-card p-6 hover:shadow-lg block">
          <b>Archivos</b>
          <p className="text-sm text-gray-500 mt-1">Proyectos terminados y entregados.</p>
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="idila-card idila-kpi">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-black mt-2" style={{ color: accent ? "var(--idila-brand)" : "var(--idila-primary)" }}>{value}</p>
    </div>
  );
}
