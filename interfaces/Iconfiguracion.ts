export interface Configuracion {
    _id?: string;
    perfil:{
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        direccion: string;
    }
    despacho:{
        nombre: string;
        rfc: string;
        email: string;
        telefono: string;
        direccion: string;
    }
}