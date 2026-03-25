import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Aprovechamos la URL que ya configuraste
import { Observable } from 'rxjs';

// Definimos la forma de los datos que vamos a enviar al backend
export interface CredencialesLogin {
  email: string;
  password?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Conectamos con el endpoint /api/usuarios/login
  private apiUrl = environment.apiUrl + '/api/usuarios/login'; 

  constructor(private http: HttpClient) { }

  // Función que hace el POST hacia tu backend
  iniciarSesion(credenciales: CredencialesLogin): Observable<any> {
    return this.http.post<any>(this.apiUrl, credenciales);
  }
}