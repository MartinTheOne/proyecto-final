export interface Pago {
    _id?: string;
    cliente: string;
    caso: string;
    monto: number;
    fecha: string;
    metodo: string;
    estado: string;
    comprobante?: string;
    notas?: string;
}