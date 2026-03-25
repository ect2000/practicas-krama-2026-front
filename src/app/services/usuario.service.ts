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

  // Función PUT que envía el usuario modificado a tu backend
  actualizarUsuario(id: number, usuarioActualizado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuarioActualizado);
  }
}