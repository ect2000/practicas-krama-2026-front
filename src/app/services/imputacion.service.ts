import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imputacion } from '../models/imputacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImputacionService {
  // Asumiendo que la URL de tu API base está en el environment y el endpoint es /api/imputaciones
  private apiUrl = `${environment.apiUrl}/api/imputaciones`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las imputaciones (útil para las vistas de administrador o informes)
   */
  getImputaciones(): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(this.apiUrl);
  }

  /**
   * Obtiene las imputaciones de un usuario específico (útil para la tabla principal del usuario)
   */
  getImputacionesByUsuario(idUsuario: number): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  /**
   * Crea una nueva imputación de horas en la base de datos
   */
  crearImputacion(imputacion: Imputacion): Observable<Imputacion> {
    return this.http.post<Imputacion>(this.apiUrl, imputacion);
  }

  /**
   * Elimina una imputación existente
   */
  eliminarImputacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}