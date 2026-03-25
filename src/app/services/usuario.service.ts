import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/api/usuarios'; 

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Función POST para crear un nuevo usuario
  crearUsuario(nuevoUsuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoUsuario);
  }

  // Función PUT que envía el usuario modificado a tu backend
  actualizarUsuario(id: number, usuarioActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuarioActualizado);
  }
}