import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

// Definimos la estructura de datos para el Proyecto
export interface Proyecto {
  id?: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  costeTotal?: number; 
  horasPresupuestadas?: number;
  cliente?: any;
  usuarios?: any[];
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

  // Función POST para crear un nuevo proyecto
  crearProyecto(nuevoProyecto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoProyecto);
  }

  // Función PUT que envía el proyecto modificado al backend
  actualizarProyecto(id: number, proyectoActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyectoActualizado);
  }
}