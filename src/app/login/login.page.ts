import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule] 
})
export class LoginPage implements OnInit {

  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  hacerLogin() {
    this.mensajeError = '';

    if (!this.correo || this.correo.trim() === '' || !this.contrasena || this.contrasena.trim() === '') {
      this.mensajeError = 'Por favor, rellena todos los campos antes de continuar.';
      return; 
    }

    const credenciales = {
      email: this.correo,
      password: this.contrasena
    };

    this.authService.iniciarSesion(credenciales).subscribe({
      next: (respuestaServidor) => {
        // Guardamos el objeto usuario
        localStorage.setItem('usuarioLogueado', JSON.stringify(respuestaServidor.usuario));
        
        // ---> CAMBIO CRUCIAL AQUÍ: Lo guardamos como 'token' <---
        localStorage.setItem('token', respuestaServidor.token); 
        
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.mensajeError = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    });
  }
}