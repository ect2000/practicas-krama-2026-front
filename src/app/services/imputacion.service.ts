import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
   * Obtiene una lista de todas las imputaciones registradas.
   * @return Observable con la respuesta del servidor.
   */
  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Pide un informe de imputaciones basado en usuarios y proyectos seleccionados.
   * @param usuariosIds Array de IDs de usuarios.
   * @param proyectosIds Array de IDs de proyectos.
   * @return Observable con los resultados del informe.
   */
  obtenerInforme1(usuariosIds: number[], proyectosIds: number[]): Observable<any[]> {
    let params = new HttpParams();
    
    if (usuariosIds && usuariosIds.length > 0) {
      params = params.append('usuarios', usuariosIds.join(','));
    }
    if (proyectosIds && proyectosIds.length > 0) {
      params = params.append('proyectos', proyectosIds.join(','));
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/informe1`, { params });
  }

  /**
   * Pide un informe de horas imputadas de un usuario en un rango de fechas.
   * @param usuarioId ID del usuario.
   * @param fechaInicio Fecha inicial en formato YYYY-MM-DD.
   * @param fechaFin Fecha final en formato YYYY-MM-DD.
   * @return Observable con el informe de fechas.
   */
  obtenerInforme2(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<any[]> {
    let params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
      
    return this.http.get<any[]>(`${this.apiUrl}/informe2`, { params });
  }

  /**
   * Obtiene un informe de imputaciones para un cliente específico.
   * @param clienteId ID del cliente.
   * @return Observable con los resultados del informe.
   */
  obtenerInforme3(clienteId: number): Observable<any[]> {
    let params = new HttpParams().set('clienteId', clienteId.toString());
    return this.http.get<any[]>(`${this.apiUrl}/informe3`, { params });
  }

  /**
   * Obtiene todas las imputaciones (versión tipada).
   * @return Observable con array de objetos Imputacion.
   */
  getImputaciones(): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(this.apiUrl);
  }

  /**
   * Obtiene imputaciones vinculadas a un usuario concreto.
   * @param idUsuario ID del usuario.
   * @return Observable con array de objetos Imputacion.
   */
  getImputacionesByUsuario(idUsuario: number): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  /**
   * Guarda una nueva imputación en la base de datos.
   * @param imputacion Datos de la imputación.
   * @return Observable con la imputación guardada.
   */
  crearImputacion(imputacion: Imputacion): Observable<Imputacion> {
    return this.http.post<Imputacion>(this.apiUrl, imputacion);
  }

  /**
   * Modifica una imputación existente.
   * @param id Identificador de la imputación.
   * @param imputacion Datos actualizados.
   * @return Observable con la imputación modificada.
   */
  actualizarImputacion(id: number, imputacion: Imputacion): Observable<Imputacion> {
    return this.http.put<Imputacion>(`${this.apiUrl}/${id}`, imputacion);
  }

  /**
   * Elimina una imputación del servidor.
   * @param id ID de la imputación a borrar.
   * @return Observable de la operación.
   */
  eliminarImputacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}