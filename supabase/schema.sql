create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','empleado');
create type public.estado_proyecto as enum ('En proceso','Terminado','Entregado');
create type public.estado_cotizacion as enum ('Borrador','Enviada','Aceptada','Rechazada');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default 'Usuario',
  email text,
  role public.app_role not null default 'empleado',
  created_at timestamptz not null default now()
);

create table public.proyectos (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  telefono text,
  direccion text,
  nombre text not null,
  medidas text,
  material text,
  descripcion text,
  fecha date,
  notas text,
  estado public.estado_proyecto not null default 'En proceso',
  creado_por uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.proyecto_empleados (
  proyecto_id uuid references public.proyectos(id) on delete cascade,
  empleado_id uuid references public.profiles(id) on delete cascade,
  primary key (proyecto_id, empleado_id)
);

create table public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid references public.proyectos(id) on delete set null,
  cliente text not null,
  subtotal numeric(12,2) not null default 0,
  iva numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  estado public.estado_cotizacion not null default 'Borrador',
  notas text,
  created_at timestamptz not null default now()
);

create table public.finanzas (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid references public.proyectos(id) on delete set null,
  tipo text not null check (tipo in ('ingreso','costo','gasto','pago')),
  concepto text not null,
  monto numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.archivos (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos(id) on delete cascade,
  nombre text not null,
  ruta text not null,
  tipo text,
  es_final boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id,nombre,email,role)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre','Usuario'), new.email, coalesce((new.raw_user_meta_data->>'role')::public.app_role,'empleado'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.proyectos enable row level security;
alter table public.proyecto_empleados enable row level security;
alter table public.cotizaciones enable row level security;
alter table public.finanzas enable row level security;
alter table public.archivos enable row level security;

create policy "profiles own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admin manages profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "projects admin or assigned" on public.proyectos for select using (
  public.is_admin() or creado_por = auth.uid() or exists(select 1 from public.proyecto_empleados pe where pe.proyecto_id=id and pe.empleado_id=auth.uid())
);
create policy "projects admin insert" on public.proyectos for insert with check (public.is_admin() or creado_por = auth.uid());
create policy "projects admin update" on public.proyectos for update using (public.is_admin() or creado_por=auth.uid()) with check (public.is_admin() or creado_por=auth.uid());
create policy "projects admin delete" on public.proyectos for delete using (public.is_admin());

create policy "assignment visible" on public.proyecto_empleados for select using (public.is_admin() or empleado_id=auth.uid());
create policy "assignment admin" on public.proyecto_empleados for all using (public.is_admin()) with check (public.is_admin());

create policy "quotes admin only" on public.cotizaciones for all using (public.is_admin()) with check (public.is_admin());
create policy "finance admin only" on public.finanzas for all using (public.is_admin()) with check (public.is_admin());
create policy "files admin or assigned" on public.archivos for select using (
  public.is_admin() or exists(select 1 from public.proyecto_empleados pe where pe.proyecto_id=proyecto_id and pe.empleado_id=auth.uid())
);
create policy "files admin" on public.archivos for all using (public.is_admin()) with check (public.is_admin());

-- Después de crear tu primer usuario, conviértelo en administrador desde el Table Editor:
-- update public.profiles set role='admin' where email='TU_CORREO';
