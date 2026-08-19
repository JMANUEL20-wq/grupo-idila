export type Role = "admin" | "empleado";
export type EstadoProyecto = "En proceso" | "Terminado" | "Entregado";
export type EstadoCotizacion = "Borrador" | "Enviada" | "Aceptada" | "Rechazada";
export type TipoMovimiento = "ingreso" | "gasto";

export type Profile = {
  id: string;
  nombre: string;
  email: string | null;
  role: Role;
};

export type Prioridad = "Baja" | "Normal" | "Alta" | "Urgente";

export type Proyecto = {
  id: string;
  cliente: string;
  empresa: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  nombre: string;
  tipo_trabajo: string | null;
  medidas: string | null;
  material: string | null;
  descripcion: string | null;
  fecha: string | null;
  fecha_entrega: string | null;
  prioridad: Prioridad | null;
  notas: string | null;
  estado: EstadoProyecto;
  creado_por: string | null;
  created_at: string;
};

export type ItemCotizacion = {
  concepto: string;
  cantidad: number;
  precio: number;
};

export type Cotizacion = {
  id: string;
  proyecto_id: string | null;
  cliente: string;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  items: ItemCotizacion[];
  subtotal: number;
  iva: number;
  total: number;
  estado: EstadoCotizacion;
  notas: string | null;
  created_at: string;
};

export type Movimiento = {
  id: string;
  proyecto_id: string | null;
  tipo: TipoMovimiento;
  concepto: string;
  monto: number;
  created_at: string;
};
