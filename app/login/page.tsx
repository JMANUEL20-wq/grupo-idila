"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Configura las variables de Supabase antes de iniciar sesión.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError("Correo o contraseña incorrectos.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 idila-hero relative overflow-hidden">
      <div className="w-full max-w-md idila-card p-8 relative">
        <div className="mb-8 flex items-center gap-3">
          <img src="/logo-mark.png" alt="" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-2xl font-black tracking-tight text-[var(--idila-primary)]" style={{ fontFamily: "var(--font-oswald)" }}>
              GRUPO IDILA
            </p>
            <p className="text-sm font-semibold text-[var(--idila-secondary)]" style={{ fontFamily: "var(--font-mono-idila)" }}>
              GESTIÓN INDUSTRIAL
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mb-6">Acceso privado al sistema. Usa tu correo registrado.</p>

        <form onSubmit={submit} className="space-y-4">
          <label>
            <span className="idila-label">Correo</span>
            <input className="idila-input" placeholder="tucorreo@ejemplo.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            <span className="idila-label">Contraseña</span>
            <input className="idila-input" placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</p>}
          <button className="idila-button w-full" disabled={loading}>{loading ? "Entrando..." : "Iniciar sesión"}</button>
        </form>

        <div className="mt-8 pt-4 border-t" style={{ borderColor: "var(--idila-border)" }}>
          <p className="text-xs text-gray-400">
            ¿No tienes cuenta? Pide a un administrador que te dé de alta desde Configuración.
          </p>
        </div>
      </div>
    </main>
  );
}
