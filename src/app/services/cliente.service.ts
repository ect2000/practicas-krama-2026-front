import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  codigo?: string; // <--- AÑADIDO AQUÍ
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = environment.apiUrl + '/api/clientes'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista completa de clientes.
   * @return Observable con el array de clientes.
   */
  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * Envía una petición para crear un nuevo cliente.
   * @param nuevoCliente Objeto con los datos del nuevo cliente.
   * @return Observable con el cliente creado.
   */
  crearCliente(nuevoCliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, nuevoCliente);
  }

  /**
   * Envía una petición para actualizar los datos de un cliente existente.
   * @param id Identificador del cliente.
   * @param clienteActualizado Objeto con los datos modificados.
   * @return Observable con el cliente actualizado.
   */
  actualizarCliente(id: number, clienteActualizado: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, clienteActualizado);
  }
}