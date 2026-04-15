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

  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

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

  obtenerInforme2(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<any[]> {
    let params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
      
    return this.http.get<any[]>(`${this.apiUrl}/informe2`, { params });
  }

  getImputaciones(): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(this.apiUrl);
  }

  getImputacionesByUsuario(idUsuario: number): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  crearImputacion(imputacion: Imputacion): Observable<Imputacion> {
    return this.http.post<Imputacion>(this.apiUrl, imputacion);
  }

  actualizarImputacion(id: number, imputacion: Imputacion): Observable<Imputacion> {
    return this.http.put<Imputacion>(`${this.apiUrl}/${id}`, imputacion);
  }

  eliminarImputacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}