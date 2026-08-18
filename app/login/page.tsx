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
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md idila-card p-8">
        <div className="mb-8">
          <p className="text-2xl font-black tracking-tight text-[#1F4D3D]">GRUPO IDILA</p>
          <p className="text-sm font-semibold text-[#6B8F7B]">Gestión Industrial</p>
        </div>
        <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mb-6">Acceso privado al sistema.</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full rounded-xl border p-3" placeholder="Correo" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full rounded-xl border p-3" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="idila-button w-full" disabled={loading}>{loading ? "Entrando..." : "Iniciar sesión"}</button>
        </form>
      </div>
    </main>
  );
}