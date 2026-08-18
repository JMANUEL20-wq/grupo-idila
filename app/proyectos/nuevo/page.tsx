 "use client";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NuevoProyectoPage() {
  const router=useRouter();
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({cliente:"",telefono:"",direccion:"",nombre:"",medidas:"",material:"",descripcion:"",fecha:"",notas:""});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  async function submit(e:FormEvent){e.preventDefault(); if(!supabase)return; setSaving(true); const {data:{user}}=await supabase.auth.getUser(); const {error}=await supabase.from("proyectos").insert({...form,creado_por:user?.id,estado:"En proceso"}); setSaving(false); if(error){alert(error.message);return} router.push("/proyectos");}
  return <main className="max-w-4xl mx-auto p-4 md:p-8"><div className="mb-6"><p className="text-[#1F4D3D] font-black">GRUPO IDILA</p><h1 className="text-3xl font-black">Nuevo proyecto</h1></div><form onSubmit={submit} className="idila-card p-6 grid md:grid-cols-2 gap-4">
    {Object.entries(form).map(([k,v])=><label key={k} className={k==="descripcion"||k==="notas"?"md:col-span-2":""}><span className="block text-sm font-semibold mb-1 capitalize">{k}</span>{k==="descripcion"||k==="notas"?<textarea className="w-full rounded-xl border p-3 min-h-28" value={v} onChange={e=>set(k,e.target.value)}/>:<input className="w-full rounded-xl border p-3" type={k==="fecha"?"date":"text"} value={v} onChange={e=>set(k,e.target.value)} required={k==="cliente"||k==="nombre"}/>}</label>)}
    <div className="md:col-span-2 flex justify-end"><button className="idila-button" disabled={saving}>{saving?"Guardando...":"Guardar proyecto"}</button></div>
  </form></main>;
}