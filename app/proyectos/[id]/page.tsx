"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Proyecto, EstadoProyecto } from "@/types";
import AppShell from "@/components/AppShell";
import Link from "next/link";

const CLIENTE_FIELDS: [keyof Proyecto, string, boolean, string?][] = [
  ["cliente", "Cliente", true],
  ["empresa", "Empresa (opcional)", false],
  ["telefono", "Teléfono", false],
  ["correo", "Correo", false, "email"],
  ["direccion", "Dirección de obra", false],
];

const PROYECTO_FIELDS: [keyof Proyecto, string, boolean, string?][] = [
  ["nombre", "Nombre del proyecto", true],
  ["tipo_trabajo", "Tipo de trabajo", false],
  ["material", "Material", false],
  ["medidas", "Medidas", false],
  ["fecha", "Fecha de inicio", false, "date"],
  ["fecha_entrega", "Entrega estimada", false, "date"],
];

const BADGE: Record<string, string> = { "En proceso": "idila-badge-proceso", Terminado: "idila-badge-terminado", Entregado: "idila-badge-entregado" };

export default function ProyectoPage() {
  const { profile, loading, logout } = useProfile();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<Proyecto | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const FIELDS = [...CLIENTE_FIELDS, ...PROYECTO_FIELDS];

  useEffect(() => {
    if (!profile || !supabase || !id) return;
    supabase.from("proyectos").select("*").eq("id", id).single().then(({ data }) => {
      setP(data);
      if (data) {
        const f: Record<string, string> = {};
        FIELDS.forEach(([k]) => { f[k] = (data[k] as string) ?? ""; });
        f.prioridad = data.prioridad ?? "Normal";
        f.descripcion = data.descripcion ?? "";
        f.notas = data.notas ?? "";
        setForm(f);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, id]);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !p) return;
    setSaving(true);
    const { error } = await supabase.from("proyectos").update(form).eq("id", p.id);
    setSaving(false);
    if (error) return setMsg("No se pudo guardar: " + error.message);
    setMsg("Cambios guardados.");
    setP({ ...p, ...form } as Proyecto);
  }

  async function cambiarEstado(estado: EstadoProyecto) {
    if (!supabase || !p) return;
    const { error } = await supabase.from("proyectos").update({ estado }).eq("id", p.id);
    if (error) return setMsg("No se pudo actualizar el estado: " + error.message);
    setP({ ...p, estado });
    if (estado !== "En proceso") router.push("/archivos");
  }

  async function eliminar() {
    if (!supabase || !p) return;
    if (!confirm("¿Eliminar este proyecto permanentemente?")) return;
    const { error } = await supabase.from("proyectos").delete().eq("id", p.id);
    if (error) return setMsg("No se pudo eliminar: " + error.message);
    router.push("/proyectos");
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;
  if (!p) return <AppShell profile={profile} logout={logout}><p className="text-gray-500">Cargando proyecto...</p></AppShell>;

  const isAdmin = profile.role === "admin";

  return (
    <AppShell profile={profile} logout={logout}>
      <Link href={p.estado === "En proceso" ? "/proyectos" : "/archivos"} className="text-sm text-[var(--idila-primary)] font-semibold">← Volver</Link>

      <form onSubmit={guardar} className="idila-card overflow-hidden mt-4">
        <div className="p-6 border-b flex flex-wrap justify-between gap-4" style={{ borderColor: "var(--idila-border)", background: "#FAFBFC" }}>
          <div>
            <p className="idila-label mb-1">Ficha de proyecto · {p.id.slice(0, 8).toUpperCase()}</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-oswald)" }}>{p.nombre}</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`idila-badge ${BADGE[p.estado]}`}>{p.estado}</span>
            <div className="flex gap-2 flex-wrap justify-end">
              {p.estado === "En proceso" && <button type="button" onClick={() => cambiarEstado("Terminado")} className="idila-button-ghost text-sm">Marcar terminado</button>}
              {p.estado === "Terminado" && <button type="button" onClick={() => cambiarEstado("Entregado")} className="idila-button-ghost text-sm">Marcar entregado</button>}
              {p.estado !== "En proceso" && <button type="button" onClick={() => cambiarEstado("En proceso")} className="idila-button-ghost text-sm">Reabrir</button>}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="idila-section-label">Datos del cliente</p>
          <div className="grid md:grid-cols-3 gap-4">
            {CLIENTE_FIELDS.map(([k, label, required, type]) => (
              <label key={k}>
                <span className="idila-label">{label}</span>
                <input className="idila-input" type={type ?? "text"} value={form[k] ?? ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={required} />
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
                <input className="idila-input" type={type ?? "text"} value={form[k] ?? ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={required} />
              </label>
            ))}
            <label>
              <span className="idila-label">Prioridad</span>
              <select className="idila-input" value={form.prioridad ?? "Normal"} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}>
                <option>Baja</option><option>Normal</option><option>Alta</option><option>Urgente</option>
              </select>
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label><span className="idila-label">Descripción del trabajo</span><textarea className="idila-input min-h-24" value={form.descripcion ?? ""} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} /></label>
            <label><span className="idila-label">Notas internas</span><textarea className="idila-input min-h-24" value={form.notas ?? ""} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} /></label>
          </div>
        </div>

        {msg && <p className="px-6 text-sm text-gray-600">{msg}</p>}

        <div className="p-6 border-t flex justify-between items-center" style={{ borderColor: "var(--idila-border)", background: "#FAFBFC" }}>
          {isAdmin ? <button type="button" onClick={eliminar} className="idila-button-danger text-sm">Eliminar proyecto</button> : <span />}
          <button className="idila-button" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
        </div>
      </form>
    </AppShell>
  );
}
