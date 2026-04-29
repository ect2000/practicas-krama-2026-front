import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = environment.apiUrl + '/api/notificaciones';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las notificaciones dirigidas a un usuario específico.
   * @param usuarioId ID del usuario destino.
   * @return Observable con la lista de notificaciones del usuario.
   */
  obtenerNotificaciones(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}