export interface Imputacion {
  id?: number;
  proyecto: { id: number }; // Lo cambiamos de idProyecto a un objeto anidado
  usuario: { id: number };  // Lo cambiamos de idUsuario a un objeto anidado
  fecha: string | Date;
  horas: number;
  anotaciones: string;
}