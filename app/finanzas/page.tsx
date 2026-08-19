"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Movimiento } from "@/types";
import AppShell from "@/components/AppShell";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

export default function FinanzasPage() {
  const { profile, loading, logout } = useProfile("admin");
  const [movs, setMovs] = useState<Movimiento[]>([]);
  const [tipo, setTipo] = useState<"ingreso" | "gasto">("ingreso");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [saving, setSaving] = useState(false);

  async function cargar() {
    if (!supabase) return;
    const { data } = await supabase.from("finanzas").select("*").order("created_at", { ascending: false });
    setMovs(data ?? []);
  }
  useEffect(() => { if (profile) cargar(); }, [profile]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !concepto || !monto) return;
    setSaving(true);
    const { error } = await supabase.from("finanzas").insert({ tipo, concepto, monto: Number(monto) });
    setSaving(false);
    if (error) { alert(error.message); return; }
    setConcepto(""); setMonto("");
    cargar();
  }

  async function eliminar(id: string) {
    if (!supabase) return;
    if (!confirm("¿Eliminar este movimiento?")) return;
    await supabase.from("finanzas").delete().eq("id", id);
    cargar();
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  const delMes = movs.filter(m => m.created_at >= startOfMonth());
  const ingresosMes = delMes.filter(m => m.tipo === "ingreso").reduce((s, m) => s + Number(m.monto), 0);
  const gastosMes = delMes.filter(m => m.tipo === "gasto").reduce((s, m) => s + Number(m.monto), 0);
  const ingresosTotal = movs.filter(m => m.tipo === "ingreso").reduce((s, m) => s + Number(m.monto), 0);
  const gastosTotal = movs.filter(m => m.tipo === "gasto").reduce((s, m) => s + Number(m.monto), 0);

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="mb-6">
        <p className="idila-label mb-1">Área exclusiva del administrador</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Finanzas</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="idila-card p-5"><p className="text-gray-500 text-sm">Ingresos del mes</p><p className="text-2xl font-black text-[var(--idila-primary)]">${ingresosMes.toLocaleString("es-MX")}</p></div>
        <div className="idila-card p-5"><p className="text-gray-500 text-sm">Gastos del mes</p><p className="text-2xl font-black" style={{ color: "var(--idila-rust)" }}>${gastosMes.toLocaleString("es-MX")}</p></div>
        <div className="idila-card p-5"><p className="text-gray-500 text-sm">Ganancia del mes</p><p className="text-2xl font-black">${(ingresosMes - gastosMes).toLocaleString("es-MX")}</p></div>
        <div className="idila-card p-5"><p className="text-gray-500 text-sm">Ganancia total</p><p className="text-2xl font-black">${(ingresosTotal - gastosTotal).toLocaleString("es-MX")}</p></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={submit} className="idila-card p-6 h-fit space-y-4">
          <p className="idila-label">Nuevo movimiento</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setTipo("ingreso")} className={`idila-button-ghost text-sm flex-1 ${tipo === "ingreso" ? "!bg-[var(--idila-bg)]" : ""}`}>Ingreso</button>
            <button type="button" onClick={() => setTipo("gasto")} className={`idila-button-ghost text-sm flex-1 ${tipo === "gasto" ? "!bg-[var(--idila-bg)]" : ""}`}>Gasto</button>
          </div>
          <label><span className="idila-label">Concepto</span><input className="idila-input" value={concepto} onChange={e => setConcepto(e.target.value)} required /></label>
          <label><span className="idila-label">Monto</span><input type="number" step="0.01" min={0} className="idila-input" value={monto} onChange={e => setMonto(e.target.value)} required /></label>
          <button className="idila-button w-full" disabled={saving}>{saving ? "Guardando..." : "Registrar"}</button>
        </form>

        <div className="md:col-span-2 idila-card overflow-hidden h-fit">
          <table className="idila-table">
            <thead><tr><th>Fecha</th><th>Concepto</th><th>Tipo</th><th>Monto</th><th></th></tr></thead>
            <tbody>
              {movs.map(m => (
                <tr key={m.id}>
                  <td>{new Date(m.created_at).toLocaleDateString("es-MX")}</td>
                  <td>{m.concepto}</td>
                  <td><span className={`idila-badge ${m.tipo === "ingreso" ? "idila-badge-terminado" : "idila-badge-rechazada"}`}>{m.tipo}</span></td>
                  <td className="font-semibold">${Number(m.monto).toLocaleString("es-MX")}</td>
                  <td><button onClick={() => eliminar(m.id)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!movs.length && <p className="text-gray-500 p-6">Sin movimientos todavía.</p>}
        </div>
      </div>
    </AppShell>
  );
}
