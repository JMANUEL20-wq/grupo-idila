 "use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Proyecto } from "@/types";
import Link from "next/link";

export default function ProyectoPage(){
 const {id}=useParams<{id:string}>(); const [p,setP]=useState<Proyecto|null>(null);
 useEffect(()=>{if(id)supabase?.from("proyectos").select("*").eq("id",id).single().then(({data})=>setP(data));},[id]);
 if(!p)return <main className="p-8">Cargando proyecto...</main>;
 return <main className="max-w-4xl mx-auto p-4 md:p-8"><Link href="/proyectos" className="text-sm text-[#1F4D3D]">← Proyectos</Link><div className="idila-card p-6 mt-4"><div className="flex justify-between gap-4 mb-6"><div><p className="text-[#1F4D3D] font-black">GRUPO IDILA</p><h1 className="text-3xl font-black">{p.nombre}</h1><p className="text-gray-500">{p.cliente}</p></div><span className="font-semibold text-[#1F4D3D]">{p.estado}</span></div><div className="grid md:grid-cols-2 gap-5">{[["Teléfono",p.telefono],["Dirección",p.direccion],["Medidas",p.medidas],["Material",p.material],["Fecha",p.fecha],["Descripción",p.descripcion],["Notas",p.notas]].map(([a,b])=><div key={a as string}><p className="text-xs uppercase tracking-wide text-gray-400">{a}</p><p className="mt-1 whitespace-pre-wrap">{b||"—"}</p></div>)}</div></div></main>;
}