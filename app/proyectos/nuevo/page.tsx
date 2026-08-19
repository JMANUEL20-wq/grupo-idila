"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/useProfile";
import AppShell from "@/components/AppShell";

const CLIENTE_FIELDS: [string, string, boolean, string?][] = [
  ["cliente", "Cliente", true],
  ["empresa", "Empresa (opcional)", false],
  ["telefono", "Teléfono", false],
  ["correo", "Correo", false, "email"],
  ["direccion", "Dirección de obra", false],
];

const PROYECTO_FIELDS: [string, string, boolean, string?][] = [
  ["nombre", "Nombre del proyecto", true],
  ["tipo_trabajo", "Tipo de trabajo", false],
  ["material", "Material", false],
  ["medidas", "Medidas", false],
  ["fecha", "Fecha de inicio", false, "date"],
  ["fecha_entrega", "Entrega estimada", false, "date"],
];

const initial = { cliente: "", empresa: "", telefono: "", correo: "", direccion: "", nombre: "", tipo_trabajo: "", material: "", medidas: "", fecha: "", fecha_entrega: "", prioridad: "Normal", descripcion: "", notas: "" };

export default function NuevoProyectoPage() {
  const { profile, loading, logout } = useProfile();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("proyectos").insert({ ...form, creado_por: user?.id, estado: "En proceso" });
    setSaving(false);
    if (error) { alert(error.message); return; }
    router.push("/proyectos");
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="mb-6">
        <p className="idila-label mb-1">Ficha de proyecto</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Nuevo proyecto</h1>
      </div>
      <form onSubmit={submit} className="idila-card overflow-hidden">
        <div className="p-6">
          <p className="idila-section-label">Datos del cliente</p>
          <div className="grid md:grid-cols-3 gap-4 mb-2">
            {CLIENTE_FIELDS.map(([k, label, required, type]) => (
              <label key={k}>
                <span className="idila-label">{label}</span>
                <input className="idila-input" type={type ?? "text"} value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} required={required} />
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t" style={{ borderColor: "var(--idila-border)" }}>
          <p className="idila-section-label">Datos del proyecto</p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {PROYECTO_FIELDS.map(([k, label, required, type]) => (
              <label key={k}>
                <span className="idila-label">{label}</span>
                <input className="idila-input" type={type ?? "text"} value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} required={required} />
              </label>
            ))}
            <label>
              <span className="idila-label">Prioridad</span>
              <select className="idila-input" value={form.prioridad} onChange={e => set("prioridad", e.target.value)}>
                <option>Baja</option><option>Normal</option><option>Alta</option><option>Urgente</option>
              </select>
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label><span className="idila-label">Descripción del trabajo</span><textarea className="idila-input min-h-24" value={form.descripcion} onChange={e => set("descripcion", e.target.value)} /></label>
            <label><span className="idila-label">Notas internas</span><textarea className="idila-input min-h-24" value={form.notas} onChange={e => set("notas", e.target.value)} /></label>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end" style={{ borderColor: "var(--idila-border)" }}>
          <button className="idila-button" disabled={saving}>{saving ? "Guardando..." : "Guardar proyecto"}</button>
        </div>
      </form>
    </AppShell>
  );
}
