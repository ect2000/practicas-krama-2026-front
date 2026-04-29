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

  /**
   * Recupera la lista de todos los usuarios registrados.
   * @return Observable con los usuarios.
   */
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Busca la información de un usuario específico.
   * @param id Identificador del usuario.
   * @return Observable con los datos del usuario.
   */
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param nuevoUsuario Objeto con la información del usuario.
   * @return Observable con el resultado de la operación.
   */
  crearUsuario(nuevoUsuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoUsuario);
  }

  /**
   * Actualiza los datos de un usuario existente.
   * @param id ID del usuario.
   * @param usuarioActualizado Datos modificados del usuario.
   * @return Observable con el usuario actualizado.
   */
  actualizarUsuario(id: number, usuarioActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuarioActualizado);
  }
}