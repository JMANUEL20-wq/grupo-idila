"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Cotizacion } from "@/types";
import AppShell from "@/components/AppShell";
import { generarPDFCotizacion } from "@/lib/pdf";

const BADGE: Record<string, string> = {
  Borrador: "idila-badge-borrador",
  Enviada: "idila-badge-enviada",
  Aceptada: "idila-badge-aceptada",
  Rechazada: "idila-badge-rechazada",
};

export default function CotizacionPage() {
  const { profile, loading, logout } = useProfile("admin");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<Cotizacion | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!profile || !supabase || !id) return;
    supabase.from("cotizaciones").select("*").eq("id", id).single().then(({ data }) => setC(data));
  }, [profile, id]);

  async function marcar(estado: Cotizacion["estado"]) {
    if (!supabase || !c) return;
    setBusy(true);
    setMsg("");

    if (estado === "Aceptada") {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: errP } = await supabase.from("proyectos").insert({
        cliente: c.cliente,
        telefono: c.telefono,
        direccion: c.direccion,
        nombre: c.nombre,
        descripcion: `Generado desde cotización aceptada. Total: $${Number(c.total).toLocaleString("es-MX")}.` + (c.notas ? ` Notas: ${c.notas}` : ""),
        notas: c.notas,
        estado: "En proceso",
        creado_por: user?.id,
      });
      if (errP) { setBusy(false); return setMsg("No se pudo crear el proyecto: " + errP.message); }
      const { error: errD } = await supabase.from("cotizaciones").delete().eq("id", c.id);
      setBusy(false);
      if (errD) return setMsg("El proyecto se creó, pero no se pudo quitar la cotización: " + errD.message);
      router.push("/proyectos");
      return;
    }

    const { error } = await supabase.from("cotizaciones").update({ estado }).eq("id", c.id);
    setBusy(false);
    if (error) return setMsg("No se pudo actualizar: " + error.message);
    setC({ ...c, estado });
  }

  async function eliminar() {
    if (!supabase || !c) return;
    if (!confirm("¿Eliminar esta cotización?")) return;
    const { error } = await supabase.from("cotizaciones").delete().eq("id", c.id);
    if (error) return setMsg(error.message);
    router.push("/cotizaciones");
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;
  if (!c) return <AppShell profile={profile} logout={logout}><p className="text-gray-500">Cargando cotización...</p></AppShell>;

  return (
    <AppShell profile={profile} logout={logout}>
      <Link href="/cotizaciones" className="text-sm text-[var(--idila-primary)] font-semibold">← Cotizaciones</Link>

      <div className="idila-card p-6 mt-4">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <p className="idila-label mb-1">{c.cliente}</p>
            <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>{c.nombre}</h1>
          </div>
          <span className={`idila-badge ${BADGE[c.estado]} self-start`}>{c.estado}</span>
        </div>

        <div className="idila-table-wrap mb-6">
          <table className="idila-table">
            <thead><tr><th>Concepto</th><th>Cant.</th><th>Precio</th><th>Importe</th></tr></thead>
            <tbody>
              {c.items.map((it, i) => (
                <tr key={i}>
                  <td>{it.concepto}</td>
                  <td>{it.cantidad}</td>
                  <td>${Number(it.precio).toLocaleString("es-MX")}</td>
                  <td>${(Number(it.cantidad) * Number(it.precio)).toLocaleString("es-MX")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="text-right space-y-1">
            <p className="text-sm text-gray-500">Subtotal: ${Number(c.subtotal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-gray-500">IVA: ${Number(c.iva).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
            <p className="text-xl font-black text-[var(--idila-primary)]">Total: ${Number(c.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {msg && <p className="text-sm text-gray-600 mb-4">{msg}</p>}

        <div className="flex flex-wrap gap-2 justify-between items-center pt-4 border-t" style={{ borderColor: "var(--idila-border)" }}>
          <button onClick={eliminar} className="idila-button-danger text-sm">Eliminar</button>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => generarPDFCotizacion(c)} className="idila-button-ghost text-sm">Descargar PDF</button>
            {c.estado === "Borrador" && <button disabled={busy} onClick={() => marcar("Enviada")} className="idila-button-ghost text-sm">Marcar enviada</button>}
            {c.estado !== "Rechazada" && <button disabled={busy} onClick={() => marcar("Rechazada")} className="idila-button-ghost text-sm">Rechazar</button>}
            <button disabled={busy} onClick={() => marcar("Aceptada")} className="idila-button text-sm">{busy ? "Procesando..." : "Aceptar → crear proyecto"}</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
