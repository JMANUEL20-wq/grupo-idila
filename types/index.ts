export type Role = "admin" | "empleado";
export type EstadoProyecto = "En proceso" | "Terminado" | "Entregado";

export type Profile = {
  id: string;
  nombre: string;
  email: string | null;
  role: Role;
};

export type Proyecto = {
  id: string;
  cliente: string;
  telefono: string | null;
  direccion: string | null;
  nombre: string;
  medidas: string | null;
  material: string | null;
  descripcion: string | null;
  fecha: string | null;
  notas: string | null;
  estado: EstadoProyecto;
  creado_por: string | null;
  created_at: string;
};

export type Cotizacion = {
  id: string;
  proyecto_id: string | null;
  cliente: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: "Borrador" | "Enviada" | "Aceptada" | "Rechazada";
  notas: string | null;
  created_at: string;
};