"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";

// Hook compartido: obtiene la sesión y el perfil del usuario logueado.
// Si no hay sesión, redirige a /login.
// Si se pasa requireRole="admin" y el usuario es "empleado", redirige a /dashboard.
export function useProfile(requireRole?: "admin") {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (requireRole === "admin" && p?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setProfile(p);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [router, requireRole]);

  async function logout() {
    await supabase?.auth.signOut();
    router.replace("/login");
  }

  return { profile, loading, logout };
}
