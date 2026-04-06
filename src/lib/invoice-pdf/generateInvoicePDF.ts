import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getEmail } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InvoiceItem = {
  name: string;
  timeSlot?: string;   // optional sub-line under name
  quantity: number;
  price: number;       // unit price
};

export type InvoiceData = {
  orderId: string;
  invoiceNumber: string;       // e.g. "#AB2324-01"
  customerName: string;
  customerPhone: string;
  address: string;
  invoiceDate: string;         // e.g. "01 Aug, 2023"
  region?: string;             // "uk" | "india"
  items: InvoiceItem[];
  deliveryCharge: number;
  couponDiscount: number;
  totalAmount: number;
  paidVia: string;
};

// ─── Color palette (mirrors Zirwa invoice) ───────────────────────────────────

const COLORS = {
  headerGradientTop: [255, 210, 210] as [number, number, number],  // light pink
  headerGradientBot: [220, 80, 80] as [number, number, number],    // rose red
  headerText: [150, 20, 20] as [number, number, number],
  accent: [192, 57, 43] as [number, number, number],               // #C0392B
  accentLight: [250, 215, 215] as [number, number, number],        // table header bg
  labelGray: [136, 136, 136] as [number, number, number],
  textDark: [34, 34, 34] as [number, number, number],
  textMid: [80, 80, 80] as [number, number, number],
  rowAlt: [245, 245, 245] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [220, 220, 220] as [number, number, number],
  discount: [192, 57, 43] as [number, number, number],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Main function ────────────────────────────────────────────────────────────

// ─── Logo loader — fetches /images/Zirwa.png from Next.js public folder ──────

async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch("/images/Zirwa.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Main function ────────────────────────────────────────────────────────────

export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  // Auto-load logo from Next.js public folder — falls back to text if not found
  const logoBase64 = await loadLogoBase64();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const PAGE_W = doc.internal.pageSize.getWidth();   // 595.28
  const PAGE_H = doc.internal.pageSize.getHeight();  // 841.89

  const MARGIN = 24;
  let cursorY = 0;

  // ── 1. Header gradient ─────────────────────────────────────────────────────
  const HEADER_H = 90;
  const STEPS = 50;
  for (let i = 0; i < STEPS; i++) {
    const t = i / (STEPS - 1);
    const [r, g, b] = lerpColor(COLORS.headerGradientTop, COLORS.headerGradientBot, t);
    doc.setFillColor(r, g, b);
    const bandY = (i * HEADER_H) / STEPS;
    doc.rect(0, bandY, PAGE_W, HEADER_H / STEPS + 0.5, "F");
  }

  // ── 2. Logo or brand text ──────────────────────────────────────────────────
  if (logoBase64) {
    try {
      // Centered in header — tune width/height to match your logo aspect ratio
      doc.addImage(logoBase64, "PNG", PAGE_W / 2 - 50, 8, 100, 70);
    } catch {
      drawBrandText(doc, PAGE_W, COLORS);
    }
  } else {
    drawBrandText(doc, PAGE_W, COLORS);
  }

  cursorY = HEADER_H + 20;

  // ── 3. "TAX INVOICE" title ─────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.textMid);
  doc.text("TAX INVOICE", PAGE_W / 2, cursorY, { align: "center" });
  cursorY += 22;

  // ── 4. Info card ───────────────────────────────────────────────────────────
  const CARD_H = 72;
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, cursorY, PAGE_W - MARGIN * 2, CARD_H, 6, 6, "FD");

  const col1X = MARGIN + 12;
  const col2X = PAGE_W * 0.38;
  const col3X = PAGE_W * 0.68;
  const labelY = cursorY + 14;
  const valueY = cursorY + 28;
  const label2Y = cursorY + 46;
  const value2Y = cursorY + 60;

  // Row 1 labels
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.labelGray);
  doc.text("Billed to", col1X, labelY);
  doc.text("Payment Method", col2X, labelY);
  doc.text("Invoice number", col3X, labelY);

  // Row 1 values
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textDark);
  doc.text(data.customerName, col1X, valueY);
  doc.text(data.paidVia, col2X, valueY);
  doc.text(data.invoiceNumber, col3X, valueY);

  // Row 2 labels
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.labelGray);
  doc.text("Delivery Address", col1X, label2Y);
  doc.text("Invoice date", col2X, label2Y);
  doc.text("Order ID", col3X, label2Y);

  // Row 2 values
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMid);
  doc.text(data.address, col1X, value2Y, { maxWidth: col2X - col1X - 10 });
  doc.text(data.invoiceDate, col2X, value2Y);
  doc.text(data.orderId.slice(0, 20), col3X, value2Y);

  cursorY += CARD_H + 16;

  // ── 5. Items table ─────────────────────────────────────────────────────────

  // Build rows: each item may have a timeSlot sub-line
  const tableRows: (string | { content: string; styles?: object })[][] = data.items.map(
    (item, idx) => {
      const descContent = item.timeSlot
        ? `${item.name}\nTime Slot => ${item.timeSlot}`
        : item.name;
      return [
        `${idx + 1}.`,
        "",
        descContent,
        String(item.quantity),
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity),
      ];
    }
  );

  // Delivery & Discount rows
  tableRows.push(["", "", "Delivery Charge", "", formatCurrency(data.deliveryCharge), formatCurrency(data.deliveryCharge)]);
  tableRows.push(["", "", "Coupon Discount", "", formatCurrency(data.couponDiscount), formatCurrency(data.couponDiscount)]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN, right: MARGIN },
    head: [["#", "", "Description", "Quantity (kg)", "Unit Fee", "Fee Amount"]],
    body: tableRows,
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },
      1: { cellWidth: 0 },   // hidden spacer
      2: { cellWidth: "auto" },
      3: { cellWidth: 72, halign: "center" },
      4: { cellWidth: 90, halign: "right" },
      5: { cellWidth: 90, halign: "right" },
    },
    headStyles: {
      fillColor: COLORS.accentLight,
      textColor: COLORS.textDark,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 7, bottom: 7, left: 6, right: 6 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.textMid,
      cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
    },
    alternateRowStyles: {
      fillColor: COLORS.rowAlt,
    },
    tableLineColor: COLORS.border,
    tableLineWidth: 0.3,
    styles: {
      lineColor: COLORS.border,
      lineWidth: 0.3,
      font: "helvetica",
      overflow: "linebreak",
    },
    didParseCell(hookData) {
      // Color discount row amount in red
      const isDiscountRow =
        hookData.row.index === tableRows.length - 1 && hookData.column.index >= 4;
      if (isDiscountRow) {
        hookData.cell.styles.textColor = COLORS.accent;
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableEndY: number = (doc as any).lastAutoTable.finalY ?? cursorY + 80;
  cursorY = tableEndY + 10;

  // ── 6. Totals section ──────────────────────────────────────────────────────
  const subTotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0) + data.deliveryCharge;
  const grandTotal = subTotal - data.couponDiscount;

  const totalsData = [
    ["SubTotal", formatCurrency(subTotal)],
    ["Discount", `-${formatCurrency(data.couponDiscount)}`],
    ["Grand Total", formatCurrency(grandTotal)],
  ];

  const COL_LABEL_W = 90;
  const COL_VAL_W = 110;
  const totalsX = PAGE_W - MARGIN - COL_LABEL_W - COL_VAL_W;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: totalsX, right: MARGIN },
    body: totalsData,
    columnStyles: {
      0: { cellWidth: COL_LABEL_W, halign: "right", fontStyle: "normal" },
      1: { cellWidth: COL_VAL_W, halign: "right" },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.textMid,
      cellPadding: { top: 3, bottom: 3, left: 6, right: 6 },
    },
    tableLineWidth: 0,
    styles: {
      lineWidth: 0,
      font: "helvetica",
    },
    didParseCell(hookData) {
      // Discount row → red
      if (hookData.row.index === 1) {
        hookData.cell.styles.textColor = COLORS.discount;
      }
      // Grand Total row → red + bold
      if (hookData.row.index === 2) {
        hookData.cell.styles.textColor = COLORS.accent;
        hookData.cell.styles.fontStyle = "bold";
        hookData.cell.styles.fontSize = 10;
      }
    },
  });

  // ── 7. Footer ──────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.labelGray);
  doc.text(
    `For any queries, please contact us at ${getEmail(data.region ?? "india")}`,
    PAGE_W / 2,
    PAGE_H - 24,
    { align: "center" }
  );

  // ── Save ───────────────────────────────────────────────────────────────────
  doc.save(`invoice-${data.orderId}.pdf`);
}

// ── Brand text fallback (when no logo image provided) ─────────────────────────

function drawBrandText(
  doc: jsPDF,
  pageW: number,
  colors: typeof COLORS
): void {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...colors.headerText);
  doc.text("Zirwa", pageW / 2, 40, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...colors.headerText);
  doc.text("Qurbani Service", pageW / 2, 60, { align: "center" });
}