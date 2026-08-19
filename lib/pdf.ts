import jsPDF from "jspdf";
import { Cotizacion } from "@/types";

const PRIMARY: [number, number, number] = [31, 77, 61]; // #1F4D3D
const SECONDARY: [number, number, number] = [107, 143, 123]; // #6B8F7B
const INK: [number, number, number] = [23, 33, 29]; // #17211d
const BORDER: [number, number, number] = [223, 230, 226]; // #dfe6e2

export function generarPDFCotizacion(c: Cotizacion) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 56;

  // Letterhead
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...PRIMARY);
  doc.text("GRUPO IDILA", M, y);
  doc.setFontSize(10);
  doc.setTextColor(...SECONDARY);
  doc.text("GESTIÓN INDUSTRIAL", M, y + 16);

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("COTIZACIÓN", W - M, y - 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`N.º ${c.id.slice(0, 8).toUpperCase()}`, W - M, y + 10, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SECONDARY);
  doc.text(new Date(c.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }), W - M, y + 24, { align: "right" });

  y += 46;
  doc.setDrawColor(...BORDER);
  doc.line(M, y, W - M, y);
  y += 24;

  // Client block
  doc.setTextColor(...SECONDARY);
  doc.setFontSize(8);
  doc.text("CLIENTE", M, y);
  doc.setTextColor(...INK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(c.cliente, M, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  let yc = y + 28;
  if (c.telefono) { doc.text(`Tel: ${c.telefono}`, M, yc); yc += 13; }
  if (c.direccion) { doc.text(c.direccion, M, yc); yc += 13; }

  doc.setTextColor(...SECONDARY);
  doc.setFontSize(8);
  doc.text("PROYECTO", W - M, y, { align: "right" });
  doc.setTextColor(...INK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(c.nombre, W - M, y + 14, { align: "right" });

  y = Math.max(yc, y + 28) + 20;

  // Table header
  doc.setFillColor(...PRIMARY);
  doc.rect(M, y, W - M * 2, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CONCEPTO", M + 8, y + 15);
  doc.text("CANT.", W - M - 190, y + 15, { align: "right" });
  doc.text("PRECIO", W - M - 100, y + 15, { align: "right" });
  doc.text("IMPORTE", W - M - 8, y + 15, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  const items = c.items?.length ? c.items : [];
  items.forEach((it, i) => {
    const rowH = 22;
    if (i % 2 === 1) {
      doc.setFillColor(245, 247, 246);
      doc.rect(M, y, W - M * 2, rowH, "F");
    }
    doc.setFontSize(9.5);
    doc.text(String(it.concepto || "—"), M + 8, y + 14, { maxWidth: W - M * 2 - 210 });
    doc.text(String(it.cantidad), W - M - 190, y + 14, { align: "right" });
    doc.text(`$${Number(it.precio).toLocaleString("es-MX")}`, W - M - 100, y + 14, { align: "right" });
    doc.text(`$${(Number(it.cantidad) * Number(it.precio)).toLocaleString("es-MX")}`, W - M - 8, y + 14, { align: "right" });
    y += rowH;
  });

  y += 10;
  doc.setDrawColor(...BORDER);
  doc.line(W - M - 200, y, W - M, y);
  y += 18;

  const totalsRow = (label: string, value: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(...(bold ? PRIMARY : INK));
    doc.text(label, W - M - 200, y);
    doc.text(`$${value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, W - M - 8, y, { align: "right" });
    y += bold ? 20 : 16;
  };
  totalsRow("Subtotal", c.subtotal);
  totalsRow("IVA", c.iva);
  totalsRow("Total", c.total, true);

  if (c.notas) {
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...SECONDARY);
    doc.text("NOTAS", M, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...INK);
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(c.notas, W - M * 2);
    doc.text(lines, M, y);
  }

  doc.save(`Cotizacion-${c.nombre.replace(/\s+/g, "_")}.pdf`);
}
