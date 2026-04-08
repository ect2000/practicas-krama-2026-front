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