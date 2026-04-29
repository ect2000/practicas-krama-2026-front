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

  /**
   * Obtiene todos los proyectos registrados en el sistema.
   * @return Observable con un array de proyectos.
   */
  obtenerProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo proyecto en el backend.
   * @param nuevoProyecto Objeto con la información del proyecto a crear.
   * @return Observable con la respuesta de la creación.
   */
  crearProyecto(nuevoProyecto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoProyecto);
  }

  /**
   * Modifica los datos de un proyecto existente.
   * @param id Identificador del proyecto.
   * @param proyectoActualizado Datos actualizados del proyecto.
   * @return Observable con el resultado de la actualización.
   */
  actualizarProyecto(id: number, proyectoActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyectoActualizado);
  }
}