import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

// Datos de ejemplo para pagos (en una aplicación real, esto vendría de una base de datos)
const pagosData = [
  {
    id: 1,
    cliente: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    caso: "Reclamación laboral",
    monto: 2500,
    fecha: "12/05/2025",
    metodo: "Transferencia",
    estado: "Completado",
    comprobante: "TRF-12345",
    notas: "Pago por servicios de asesoría legal",
  },
  {
    id: 2,
    cliente: "María López",
    email: "maria.lopez@ejemplo.com",
    caso: "Divorcio",
    monto: 1800,
    fecha: "10/05/2025",
    metodo: "Tarjeta de crédito",
    estado: "Completado",
    comprobante: "CC-67890",
    notas: "Pago inicial por trámites de divorcio",
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    caso: "Herencia",
    monto: 3200,
    fecha: "05/05/2025",
    metodo: "Efectivo",
    estado: "Completado",
    comprobante: "EFT-54321",
    notas: "Pago por gestión de herencia",
  },
  {
    id: 4,
    cliente: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    caso: "Reclamación de seguro",
    monto: 1500,
    fecha: "01/06/2025",
    metodo: "Transferencia",
    estado: "Pendiente",
    comprobante: "TRF-98765",
    notas: "Pago parcial por reclamación de seguro",
  },
  {
    id: 5,
    cliente: "Roberto Sánchez",
    email: "roberto.sanchez@ejemplo.com",
    caso: "Disputa contractual",
    monto: 2000,
    fecha: "15/06/2025",
    metodo: "Cheque",
    estado: "Pendiente",
    comprobante: "CHK-24680",
    notas: "Pago por asesoría en disputa contractual",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Asegurarse de que params.id sea una cadena antes de convertirla a número
    const id = Number.parseInt(params.id, 10)

    // Buscar el pago por ID
    const pago = pagosData.find((p) => p.id === id)

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    // Crear un nuevo documento PDF
    const doc = new jsPDF()

    // Generar el recibo
    generateReceipt(doc, pago)

    // Obtener el PDF como array buffer
    const pdfBuffer = doc.output("arraybuffer")

    // Devolver el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="recibo-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error al generar el recibo:", error)
    return NextResponse.json({ error: "Error al generar el recibo" }, { status: 500 })
  }
}

function generateReceipt(doc: jsPDF, pago: any) {
  // Colores
  const primaryColor = "#001F3F"
  const secondaryColor = "#003366"

  // Configuración de márgenes
  const margin = 15
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - 2 * margin

  // Encabezado
  doc.setFontSize(22)
  doc.setTextColor(primaryColor)
  doc.text("LEGALMANAGER", pageWidth / 2, margin + 10, { align: "center" })

  doc.setFontSize(16)
  doc.text("Recibo de Pago", pageWidth / 2, margin + 20, { align: "center" })

  // Línea separadora
  doc.setDrawColor(primaryColor)
  doc.setLineWidth(0.5)
  doc.line(margin, margin + 25, pageWidth - margin, margin + 25)

  // Información del despacho
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("González & Asociados", margin, margin + 35)
  doc.text("Av. Reforma 500, Piso 12, Ciudad", margin, margin + 40)
  doc.text("Tel: 555-987-6543", margin, margin + 45)
  doc.text("Email: contacto@gonzalezasociados.com", margin, margin + 50)

  // Información del recibo
  doc.setFontSize(12)
  doc.setTextColor(secondaryColor)
  doc.text("RECIBO N°:", margin, margin + 65)
  doc.setTextColor(0, 0, 0)
  doc.text(`${pago.id}-${new Date().getFullYear()}`, margin + 30, margin + 65)

  doc.setTextColor(secondaryColor)
  doc.text("FECHA DE EMISIÓN:", margin, margin + 72)
  doc.setTextColor(0, 0, 0)
  doc.text(new Date().toLocaleDateString(), margin + 50, margin + 72)

  // Información del cliente
  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.text("DATOS DEL CLIENTE", margin, margin + 85)
  doc.setLineWidth(0.2)
  doc.line(margin, margin + 87, margin + 60, margin + 87)

  doc.setTextColor(secondaryColor)
  doc.text("Cliente:", margin, margin + 95)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.cliente, margin + 30, margin + 95)

  doc.setTextColor(secondaryColor)
  doc.text("Email:", margin, margin + 102)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.email || "No disponible", margin + 30, margin + 102)

  // Información del pago
  doc.setTextColor(primaryColor)
  doc.text("DETALLES DEL PAGO", margin, margin + 115)
  doc.setLineWidth(0.2)
  doc.line(margin, margin + 117, margin + 60, margin + 117)

  doc.setTextColor(secondaryColor)
  doc.text("Concepto:", margin, margin + 125)
  doc.setTextColor(0, 0, 0)
  doc.text(`Servicios legales - ${pago.caso}`, margin + 30, margin + 125)

  doc.setTextColor(secondaryColor)
  doc.text("Fecha del pago:", margin, margin + 132)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.fecha, margin + 50, margin + 132)

  doc.setTextColor(secondaryColor)
  doc.text("Método de pago:", margin, margin + 139)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.metodo, margin + 50, margin + 139)

  doc.setTextColor(secondaryColor)
  doc.text("Comprobante:", margin, margin + 146)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.comprobante || "No disponible", margin + 50, margin + 146)

  doc.setTextColor(secondaryColor)
  doc.text("Estado:", margin, margin + 153)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.estado, margin + 30, margin + 153)

  // Si el pago está pendiente, añadir marca de agua
  if (pago.estado === "Pendiente") {
    doc.setTextColor(200, 50, 50)
    doc.setFontSize(60)
    doc.setGState(new doc.GState({ opacity: 0.2 }))
    doc.text("PENDIENTE", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    })
    doc.setGState(new doc.GState({ opacity: 1.0 }))
  }

  // Tabla de resumen
  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.text("RESUMEN", margin, margin + 170)
  doc.setLineWidth(0.2)
  doc.line(margin, margin + 172, margin + 30, margin + 172)

  // Usar jspdf-autotable para crear una tabla
  autoTable(doc, {
    startY: margin + 175,
    head: [["Descripción", "Monto"]],
    body: [
      [`Servicios legales - ${pago.caso}`, `$${pago.monto.toLocaleString()}`],
      ["TOTAL", `$${pago.monto.toLocaleString()}`],
    ],
    headStyles: {
      fillColor: [0, 31, 63], // primaryColor en RGB
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    foot: [],
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    footStyles: {
      fillColor: [0, 31, 63],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    theme: "grid",
    margin: { left: margin, right: margin },
  })

  // Notas
  if (pago.notas) {
    const finalY = (doc as any).lastAutoTable.finalY || 200
    doc.setFontSize(12)
    doc.setTextColor(primaryColor)
    doc.text("NOTAS", margin, finalY + 15)
    doc.setLineWidth(0.2)
    doc.line(margin, finalY + 17, margin + 20, finalY + 17)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)

    // Dividir notas largas en múltiples líneas
    const splitNotes = doc.splitTextToSize(pago.notas, contentWidth)
    doc.text(splitNotes, margin, finalY + 25)
  }

  // Pie de página
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Este documento es un comprobante de pago válido.", pageWidth / 2, pageHeight - 30, { align: "center" })
  doc.text("Gracias por confiar en nuestros servicios legales.", pageWidth / 2, pageHeight - 25, { align: "center" })
  doc.setTextColor(primaryColor)
  doc.text("LegalManager © 2025", pageWidth / 2, pageHeight - 20, { align: "center" })
}
