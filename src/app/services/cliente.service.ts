import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

// Definimos la estructura de datos para que el frontend entienda qué es un Cliente
export interface Cliente {
  id?: number;
  nombre: string;
  // Puedes añadir más campos si tu backend los tiene (ej. email, direccion)
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // Unimos la URL de tu entorno (http://localhost:8080) con la ruta de tu API
  private apiUrl = environment.apiUrl + '/api/clientes'; 

  constructor(private http: HttpClient) { }

  // Función que hace la petición GET al backend para traer la lista
  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }
}