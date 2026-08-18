 "use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function FinanzasPage(){
 const router=useRouter(); const [ok,setOk]=useState<boolean|null>(null);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase!.auth.getUser(); if(!user)return router.replace("/login"); const {data}=await supabase!.from("profiles").select("role").eq("id",user.id).single(); if(data?.role!=="admin") router.replace("/dashboard"); else setOk(true);})();},[router]);
 if(!ok)return <main className="p-8">Verificando permisos...</main>;
 return <main className="max-w-6xl mx-auto p-4 md:p-8"><p className="text-[#1F4D3D] font-black">GRUPO IDILA</p><h1 className="text-3xl font-black mb-2">Finanzas</h1><p className="text-gray-500 mb-6">Área exclusiva del administrador.</p><div className="grid md:grid-cols-3 gap-4"><div className="idila-card p-6"><p className="text-gray-500">Ingresos</p><p className="text-3xl font-black">$0.00</p></div><div className="idila-card p-6"><p className="text-gray-500">Costos</p><p className="text-3xl font-black">$0.00</p></div><div className="idila-card p-6"><p className="text-gray-500">Ganancia</p><p className="text-3xl font-black">$0.00</p></div></div></main>;
}