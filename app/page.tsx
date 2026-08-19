import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <div className="idila-hero">
        <div className="relative flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="" className="w-9 h-9 object-contain" />
            <div>
              <p className="font-extrabold tracking-tight text-white leading-none" style={{ fontFamily: "var(--font-oswald)" }}>GRUPO IDILA</p>
              <p className="text-[10px] text-white/50 tracking-wider" style={{ fontFamily: "var(--font-mono-idila)" }}>GESTIÓN INDUSTRIAL</p>
            </div>
          </div>
          <Link href="/login" className="idila-button" style={{ background: "white", color: "var(--idila-primary)" }}>Acceder al sistema</Link>
        </div>

        <div className="relative px-6 md:px-10 py-16 md:py-20 flex flex-wrap items-center gap-10">
          <div className="flex-1 min-w-[300px]">
            <p className="text-xs tracking-widest mb-3" style={{ fontFamily: "var(--font-mono-idila)", color: "var(--idila-gold)" }}>SISTEMA INTERNO DE OPERACIÓN</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Control total del<br />taller, en un solo lugar.
            </h1>
            <p className="text-white/65 max-w-md mb-7">
              Proyectos, cotizaciones y finanzas — desde el primer contacto con el cliente hasta la entrega final.
            </p>
            <Link href="/login" className="idila-button" style={{ background: "white", color: "var(--idila-primary)" }}>Acceder al sistema</Link>
          </div>

          <div className="flex-none w-full md:w-[340px]">
            <div className="idila-card overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: "var(--idila-border)", background: "#FAFBFC" }}>
                <p className="text-[10px] text-gray-500" style={{ fontFamily: "var(--font-mono-idila)" }}>RESUMEN DE OPERACIÓN</p>
                <span className="idila-badge idila-badge-terminado">En línea</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Proyectos activos</p><p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-oswald)" }}>14</p></div>
                <div><p className="text-xs text-gray-500">Entregados este mes</p><p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-oswald)" }}>9</p></div>
                <div><p className="text-xs text-gray-500">Cotizaciones activas</p><p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-oswald)" }}>5</p></div>
                <div><p className="text-xs text-gray-500">Módulos</p><p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-oswald)", color: "var(--idila-brand)" }}>6</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-6">
        {[
          ["Proyectos y archivos", "Ficha completa de cada trabajo: cliente, medidas, material y fechas. Al terminar, pasa automáticamente a Archivos."],
          ["Cotizaciones", "Genera cotizaciones con tus datos, descárgalas en PDF y conviértelas en proyecto con un clic al ser aceptadas."],
          ["Finanzas", "Ingresos y gastos del taller, con el resumen del mes siempre a la vista."],
        ].map(([t, d]) => (
          <div key={t} className="idila-card p-6">
            <h3 className="font-bold mb-2">{t}</h3>
            <p className="text-sm text-gray-500">{d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: "var(--idila-border)" }}>
        <Link href="/login" className="idila-button">Acceder al sistema</Link>
      </footer>
    </main>
  );
}
