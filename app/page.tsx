import Link from "next/link";

const display = { fontFamily: "var(--font-oswald), Arial, sans-serif" };
const mono = { fontFamily: "var(--font-mono-idila), monospace" };
const body = { fontFamily: "var(--font-inter), Arial, sans-serif" };

const PASOS = [
  {
    n: "01",
    titulo: "Ingreso",
    detalle: "Se registra el proyecto: cliente, medidas, material y descripción del trabajo.",
  },
  {
    n: "02",
    titulo: "En proceso",
    detalle: "El equipo ejecuta el trabajo. Cada ficha guarda notas y estado en tiempo real.",
  },
  {
    n: "03",
    titulo: "Terminado",
    detalle: "La pieza queda lista. La ficha pasa a revisión antes de salir del taller.",
  },
  {
    n: "04",
    titulo: "Entregado",
    detalle: "Se cierra el proyecto y queda archivado en el historial del cliente.",
  },
];

const MODULOS = [
  {
    codigo: "MOD-01",
    titulo: "Proyectos",
    detalle: "Fichas por cliente con medidas, material, estado y notas de avance.",
  },
  {
    codigo: "MOD-02",
    titulo: "Cotizaciones",
    detalle: "Subtotal, IVA y total por proyecto. Control de enviadas y aceptadas.",
  },
  {
    codigo: "MOD-03",
    titulo: "Finanzas",
    detalle: "Ingresos, costos y ganancia del taller. Acceso exclusivo de administrador.",
  },
];

export default function Home() {
  return (
    <main style={body} className="min-h-screen text-[var(--idila-ink)]">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6 md:px-10">
        <div>
          <p style={display} className="text-lg tracking-wide text-[var(--idila-primary)]">
            GRUPO IDILA
          </p>
          <p style={mono} className="text-[11px] tracking-[0.2em] text-[var(--idila-secondary)] uppercase">
            Gestión Industrial
          </p>
        </div>
        <Link href="/login" className="idila-button text-sm">
          Acceder al sistema
        </Link>
      </header>

      {/* Hero */}
      <section className="relative idila-blueprint border-y border-[var(--idila-border)] overflow-hidden">
        <div className="idila-crosshair top-6 left-6" />
        <div className="idila-crosshair top-6 right-6" />
        <div className="idila-crosshair bottom-6 left-6" />
        <div className="idila-crosshair bottom-6 right-6" />

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p style={mono} className="text-xs tracking-[0.25em] text-[var(--idila-secondary)] uppercase mb-4">
              Sistema privado · Uso interno
            </p>
            <h1 style={display} className="text-4xl md:text-5xl leading-[1.05] text-[var(--idila-primary)] mb-5">
              El taller,<br />bajo control.
            </h1>
            <p className="text-base md:text-lg text-[var(--idila-ink)]/75 max-w-md mb-8">
              GRUPO IDILA centraliza cada proyecto desde que el cliente entra por la puerta
              hasta que la pieza sale terminada: fichas, cotizaciones y finanzas en un solo lugar.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="idila-button">
                Acceder al sistema
              </Link>
              <span style={mono} className="text-xs text-[var(--idila-secondary)]">
                Acceso restringido a personal autorizado
              </span>
            </div>
          </div>

          {/* Ticket / ficha técnica como pieza central */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              style={{ ...mono }}
              className="idila-ticket idila-card p-6 rotate-[1.5deg] bg-white"
            >
              <div
                style={{ ...display }}
                className="idila-stamp inline-block px-3 py-1 text-[10px] tracking-widest uppercase mb-5 rounded-full"
              >
                Grupo Idila
              </div>

              <div className="space-y-3 text-sm">
                <Campo etiqueta="Cliente" valor="——————————" />
                <Campo etiqueta="Material" valor="——————" />
                <Campo etiqueta="Medidas" valor="————" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--idila-secondary)]">
                    Estado
                  </span>
                  <span className="flex items-center gap-2 text-xs font-medium text-[var(--idila-primary)]">
                    <span className="idila-pulse h-2 w-2 rounded-full bg-[var(--idila-primary)]" />
                    En proceso
                  </span>
                </div>
              </div>

              <div className="idila-ticket-tear mt-6 pt-4 flex justify-between text-[10px] text-[var(--idila-secondary)] uppercase tracking-widest">
                <span>Ficha de proyecto</span>
                <span>N.º —</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p style={mono} className="text-xs tracking-[0.25em] text-[var(--idila-secondary)] uppercase mb-2">
          Flujo del proyecto
        </p>
        <h2 style={display} className="text-2xl md:text-3xl text-[var(--idila-primary)] mb-10">
          De la entrada a la entrega
        </h2>

        <div className="relative">
          <div className="hidden md:block idila-node-line absolute top-5 left-[6%] right-[6%]" />
          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {PASOS.map((paso) => (
              <div key={paso.n} className="relative">
                <div
                  style={mono}
                  className="hidden md:flex h-10 w-10 rounded-full border-2 border-[var(--idila-primary)] bg-[var(--idila-bg)] items-center justify-center text-xs text-[var(--idila-primary)] mb-4 relative z-10"
                >
                  {paso.n}
                </div>
                <p style={mono} className="md:hidden text-xs text-[var(--idila-secondary)] mb-1">
                  {paso.n}
                </p>
                <h3 style={display} className="text-lg text-[var(--idila-ink)] mb-1">
                  {paso.titulo}
                </h3>
                <p className="text-sm text-[var(--idila-ink)]/70">{paso.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section className="border-t border-[var(--idila-border)] bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <p style={mono} className="text-xs tracking-[0.25em] text-[var(--idila-secondary)] uppercase mb-2">
            Dentro del sistema
          </p>
          <h2 style={display} className="text-2xl md:text-3xl text-[var(--idila-primary)] mb-10">
            Tres módulos, un solo lugar
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {MODULOS.map((m) => (
              <div key={m.codigo} className="idila-card p-6">
                <p style={mono} className="text-[10px] tracking-widest text-[var(--idila-secondary)] mb-3">
                  {m.codigo}
                </p>
                <h3 style={display} className="text-xl text-[var(--idila-primary)] mb-2">
                  {m.titulo}
                </h3>
                <p className="text-sm text-[var(--idila-ink)]/70">{m.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA final */}
      <footer className="idila-blueprint border-t border-[var(--idila-border)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p style={display} className="text-xl text-[var(--idila-primary)]">
              GRUPO IDILA
            </p>
            <p className="text-sm text-[var(--idila-ink)]/60">
              Sistema privado de gestión industrial.
            </p>
          </div>
          <Link href="/login" className="idila-button">
            Acceder al sistema
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[var(--idila-border)] pb-2">
      <span className="text-[10px] uppercase tracking-widest text-[var(--idila-secondary)]">
        {etiqueta}
      </span>
      <span className="text-[var(--idila-ink)]/40">{valor}</span>
    </div>
  );
}
