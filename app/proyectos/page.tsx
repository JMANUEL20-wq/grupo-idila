 "use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Proyecto } from "@/types";

export default function ProyectosPage() {
  const [items,setItems]=useState<Proyecto[]>([]);
  useEffect(()=>{supabase?.from("proyectos").select("*").order("created_at",{ascending:false}).then(({data})=>setItems(data??[]));},[]);
  return <main className="max-w-6xl mx-auto p-4 md:p-8">
    <div className="flex justify-between items-center mb-6"><div><p className="text-[#1F4D3D] font-black">GRUPO IDILA</p><h1 className="text-3xl font-black">Proyectos</h1></div><Link href="/proyectos/nuevo" className="idila-button">Nuevo proyecto</Link></div>
    <div className="grid gap-3">{items.map(p=><Link href={`/proyectos/${p.id}`} key={p.id} className="idila-card p-5"><div className="flex justify-between gap-4"><div><h2 className="font-bold">{p.nombre}</h2><p className="text-gray-500">{p.cliente}</p></div><span className="text-sm font-semibold text-[#1F4D3D]">{p.estado}</span></div></Link>)}{!items.length&&<div className="idila-card p-8 text-gray-500">No hay proyectos todavía.</div>}</div>
  </main>;
}