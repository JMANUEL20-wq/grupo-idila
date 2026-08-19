"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/useProfile";
import AppShell from "@/components/AppShell";
import { ItemCotizacion } from "@/types";

export default function NuevaCotizacionPage() {
  const { profile, loading, logout } = useProfile("admin");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [cliente, setCliente] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [ivaPct, setIvaPct] = useState(16);
  const [items, setItems] = useState<ItemCotizacion[]>([{ concepto: "", cantidad: 1, precio: 0 }]);

  const subtotal = items.reduce((s, it) => s + Number(it.cantidad || 0) * Number(it.precio || 0), 0);
  const iva = subtotal * (ivaPct / 100);
  const total = subtotal + iva;

  function setItem(i: number, patch: Partial<ItemCotizacion>) {
    setItems(arr => arr.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addItem() { setItems(arr => [...arr, { concepto: "", cantidad: 1, precio: 0 }]); }
  function removeItem(i: number) { setItems(arr => arr.filter((_, idx) => idx !== i)); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const { error, data } = await supabase.from("cotizaciones").insert({
      cliente, nombre, telefono, direccion, notas,
      items: items.filter(it => it.concepto.trim()),
      subtotal, iva, total, estado: "Borrador",
    }).select().single();
    setSaving(false);
    if (error) { alert(error.message); return; }
    router.push(`/cotizaciones/${data.id}`);
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="mb-6">
        <p className="idila-label mb-1">Nueva</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Cotización</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="idila-card p-6 grid md:grid-cols-2 gap-4">
          <label><span className="idila-label">Nombre del proyecto</span><input className="idila-input" value={nombre} onChange={e => setNombre(e.target.value)} required /></label>
          <label><span className="idila-label">Cliente</span><input className="idila-input" value={cliente} onChange={e => setCliente(e.target.value)} required /></label>
          <label><span className="idila-label">Teléfono</span><input className="idila-input" value={telefono} onChange={e => setTelefono(e.target.value)} /></label>
          <label><span className="idila-label">Dirección</span><input className="idila-input" value={direccion} onChange={e => setDireccion(e.target.value)} /></label>
        </div>

        <div className="idila-card p-6">
          <p className="idila-label mb-3">Conceptos</p>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <label className="col-span-6"><span className="idila-label">Concepto</span><input className="idila-input" value={it.concepto} onChange={e => setItem(i, { concepto: e.target.value })} /></label>
                <label className="col-span-2"><span className="idila-label">Cant.</span><input type="number" min={0} className="idila-input" value={it.cantidad} onChange={e => setItem(i, { cantidad: Number(e.target.value) })} /></label>
                <label className="col-span-3"><span className="idila-label">Precio unit.</span><input type="number" min={0} step="0.01" className="idila-input" value={it.precio} onChange={e => setItem(i, { precio: Number(e.target.value) })} /></label>
                <button type="button" onClick={() => removeItem(i)} className="col-span-1 idila-button-ghost text-sm h-[42px]">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="idila-button-ghost text-sm mt-3">+ Agregar concepto</button>
        </div>

        <div className="idila-card p-6 grid md:grid-cols-2 gap-4">
          <label><span className="idila-label">Notas</span><textarea className="idila-input min-h-24" value={notas} onChange={e => setNotas(e.target.value)} /></label>
          <div>
            <label className="block mb-3"><span className="idila-label">IVA (%)</span><input type="number" className="idila-input" value={ivaPct} onChange={e => setIvaPct(Number(e.target.value))} /></label>
            <div className="text-right space-y-1">
              <p className="text-sm text-gray-500">Subtotal: ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-gray-500">IVA: ${iva.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
              <p className="text-xl font-black text-[var(--idila-primary)]">Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="idila-button" disabled={saving}>{saving ? "Guardando..." : "Guardar cotización"}</button>
        </div>
      </form>
    </AppShell>
  );
}
