"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";
import { Profile } from "@/types";
import AppShell from "@/components/AppShell";

export default function ConfiguracionPage() {
  const { profile, loading, logout } = useProfile("admin");
  const [usuarios, setUsuarios] = useState<Profile[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"admin" | "empleado">("empleado");
  const [saving, setSaving] = useState(false);

  async function authHeader() {
    const { data: { session } } = await supabase!.auth.getSession();
    return { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` };
  }

  async function cargar() {
    setCargando(true);
    const res = await fetch("/api/usuarios", { headers: await authHeader() });
    const json = await res.json();
    if (res.ok) setUsuarios(json.usuarios);
    else setError(json.error);
    setCargando(false);
  }
  useEffect(() => { if (profile) cargar(); }, [profile]);

  async function crear(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: await authHeader(),
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) return setError(json.error);
    setNombre(""); setEmail(""); setPassword(""); setRol("empleado");
    cargar();
  }

  async function eliminar(id: string, nombreU: string) {
    if (!confirm(`¿Eliminar el acceso de ${nombreU}?`)) return;
    const res = await fetch("/api/usuarios", { method: "DELETE", headers: await authHeader(), body: JSON.stringify({ id }) });
    const json = await res.json();
    if (!res.ok) return setError(json.error);
    cargar();
  }

  if (loading || !profile) return <main className="p-8">Cargando...</main>;

  return (
    <AppShell profile={profile} logout={logout}>
      <div className="mb-6">
        <p className="idila-label mb-1">Área exclusiva del administrador</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-oswald)" }}>Configuración</h1>
        <p className="text-gray-500 mt-1">Da de alta o elimina el acceso de usuarios al sistema.</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={crear} className="idila-card p-6 h-fit space-y-4">
          <p className="idila-label">Nuevo usuario</p>
          <label><span className="idila-label">Nombre</span><input className="idila-input" value={nombre} onChange={e => setNombre(e.target.value)} required /></label>
          <label><span className="idila-label">Correo</span><input type="email" className="idila-input" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label><span className="idila-label">Contraseña</span><input type="password" className="idila-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></label>
          <label>
            <span className="idila-label">Rol</span>
            <select className="idila-input" value={rol} onChange={e => setRol(e.target.value as "admin" | "empleado")}>
              <option value="empleado">Empleado — solo proyectos y archivos</option>
              <option value="admin">Administrador — acceso total</option>
            </select>
          </label>
          <button className="idila-button w-full" disabled={saving}>{saving ? "Creando..." : "Crear usuario"}</button>
        </form>

        <div className="md:col-span-2 idila-card overflow-hidden h-fit">
          <table className="idila-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th></th></tr></thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td className="font-semibold">{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className={`idila-badge ${u.role === "admin" ? "idila-badge-terminado" : "idila-badge-borrador"}`}>{u.role}</span></td>
                  <td>{u.id !== profile.id && <button onClick={() => eliminar(u.id, u.nombre)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cargando && <p className="text-gray-500 p-6">Cargando usuarios...</p>}
          {!cargando && !usuarios.length && <p className="text-gray-500 p-6">No hay usuarios.</p>}
        </div>
      </div>
    </AppShell>
  );
}
