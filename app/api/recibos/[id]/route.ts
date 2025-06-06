import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { MongoClient, ObjectId } from 'mongodb';
import { Pago } from "@/interfaces/Ipago"
import { Configuracion } from "@/interfaces/Iconfiguracion";
// MongoDB connection
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || '';
const collectionName = 'pagos';
const collectionConfig = 'configuracion';

// Interface for Pago

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db(dbName);
}


export async function findById(id: string) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName)
    const collectionCon = db.collection(collectionConfig)

    const pago = await collection.findOne<Pago>({ _id: new ObjectId(id) as any });
    const configuracion = await collectionCon.findOne<Configuracion>({});

    if (!pago) return null

    return {
      pago: pago,
      configuracion: configuracion
    };
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {

    const id = context.params.id

    if (!id) {
      return NextResponse.json({ error: "Falta el parámetro 'id'" }, { status: 400 })
    }
    const data = await findById(id)

    if (!data || !(data as any).pago) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    if (!(data as any).configuracion) {
      return NextResponse.json({ error: "configuracion no encontrado" }, { status: 402 })
    }
    console.log(data.configuracion)

    const doc = new jsPDF()

    generateReceipt(doc, data.pago, data.configuracion)

    const pdfBuffer = doc.output("arraybuffer")

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

function generateReceipt(doc: jsPDF, pago: any, configuracion: any) {

  const primaryColor = "#001F3F"
  const secondaryColor = "#003366"

  const margin = 15
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - 2 * margin

  doc.setFontSize(22)
  doc.setTextColor(primaryColor)
  doc.text("Gestion de Abogado", pageWidth / 2, margin + 10, { align: "center" })

  doc.setFontSize(16)
  doc.text("Recibo de Pago", pageWidth / 2, margin + 20, { align: "center" })

  doc.setDrawColor(primaryColor)
  doc.setLineWidth(0.5)
  doc.line(margin, margin + 25, pageWidth - margin, margin + 25)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(configuracion.perfil.nombre + " " + configuracion.perfil.apellido, margin, margin + 35)
  doc.text(configuracion.perfil.direccion, margin, margin + 40)
  doc.text("Tel: " + configuracion.perfil.telefono, margin, margin + 45)
  doc.text("Email: " + configuracion.perfil.email, margin, margin + 50)

  doc.setFontSize(12)
  doc.setTextColor(secondaryColor)
  doc.text("RECIBO N°:", margin, margin + 65)
  doc.setTextColor(0, 0, 0)
  doc.text(`${pago._id}`, margin + 30, margin + 65)

  doc.setTextColor(secondaryColor)
  doc.text("FECHA DE EMISIÓN:", margin, margin + 72)
  doc.setTextColor(0, 0, 0)
  doc.text(new Date().toLocaleDateString(), margin + 50, margin + 72)

  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.text("DATOS DEL CLIENTE", margin, margin + 85)
  doc.setLineWidth(0.2)
  doc.line(margin, margin + 87, margin + 60, margin + 87)

  doc.setTextColor(secondaryColor)
  doc.text("Cliente:", margin, margin + 95)
  doc.setTextColor(0, 0, 0)
  doc.text(pago.cliente, margin + 30, margin + 95)

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


  if (pago.estado === "Pendiente") {
    doc.setTextColor(200, 50, 50)
    doc.setFontSize(60)
    doc.setGState(doc.GState({ opacity: 0.2 }))
    doc.text("PENDIENTE", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    })
    doc.setGState(doc.GState({ opacity: 1.0 }))
  }

  // Tabla de resumen
  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.text("RESUMEN", margin, margin + 170)
  doc.setLineWidth(0.2)
  doc.line(margin, margin + 172, margin + 30, margin + 172)


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
  doc.text("Gestion de Abogado © 2025", pageWidth / 2, pageHeight - 20, { align: "center" })
}
