"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Profile } from "@/types";
import type { ReactElement } from "react";

const ICONS: Record<string, ReactElement> = {
  dashboard: <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z" />,
  proyectos: <path d="M4 6h16M4 12h16M4 18h10" />,
  archivos: <path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />,
  cotizaciones: <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5" />,
  finanzas: <path d="M3 17l5-5 4 4 8-8M14 8h6v6" />,
  configuracion: <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />,
};

type NavItem = { href: string; label: string; icon: keyof typeof ICONS; adminOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/proyectos", label: "Proyectos", icon: "proyectos" },
  { href: "/archivos", label: "Archivos", icon: "archivos" },
  { href: "/cotizaciones", label: "Cotizaciones", icon: "cotizaciones", adminOnly: true },
  { href: "/finanzas", label: "Finanzas", icon: "finanzas", adminOnly: true },
  { href: "/configuracion", label: "Configuración", icon: "configuracion", adminOnly: true },
];

export default function AppShell({
  profile,
  logout,
  children,
}: {
  profile: Profile | null;
  logout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="idila-shell">
      <aside className="idila-sidebar p-4">
        <div className="px-2 py-3 mb-4 flex items-center gap-2">
          <img src="/logo-mark.png" alt="" className="w-8 h-8 object-contain" />
          <div>
            <p className="font-black tracking-tight leading-none" style={{ fontFamily: "var(--font-oswald)" }}>GRUPO IDILA</p>
            <p className="text-[10px] text-white/60 font-semibold">Gestión Industrial</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.filter(n => !n.adminOnly || isAdmin).map(n => {
            const active = pathname === n.href || pathname?.startsWith(n.href + "/");
            return (
              <Link key={n.href} href={n.href} className={`idila-nav-link ${active ? "active" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[n.icon]}
                </svg>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10">
          <p className="px-2 text-sm text-white/80 truncate">{profile?.nombre}</p>
          <p className="px-2 text-xs text-white/50 mb-3 capitalize">{profile?.role}</p>
          <button onClick={logout} className="w-full text-left idila-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
