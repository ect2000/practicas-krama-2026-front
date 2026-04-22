import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

export interface Proyecto {
  id?: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  costeTotal?: number;
  horasPresupuestadas?: number;
  cliente?: any; // O la interface Cliente si la tienes
  usuarios?: any[];
  // ---> AÑADE ESTA LÍNEA <---
  encargado?: any; 
}

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = environment.apiUrl + '/api/proyectos'; 

  constructor(private http: HttpClient) { }

  obtenerProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  crearProyecto(nuevoProyecto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoProyecto);
  }

  actualizarProyecto(id: number, proyectoActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyectoActualizado);
  }
}