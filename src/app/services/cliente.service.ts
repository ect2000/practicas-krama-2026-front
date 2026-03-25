import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = environment.apiUrl + '/api/clientes'; 

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  crearCliente(nuevoCliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, nuevoCliente);
  }

  actualizarCliente(id: number, clienteActualizado: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, clienteActualizado);
  }
}