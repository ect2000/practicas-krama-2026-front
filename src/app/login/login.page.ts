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

  /**
   * Intenta autenticar al usuario usando las credenciales proporcionadas.
   * Si es exitoso, guarda los datos en localStorage y redirige al inicio.
   */
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

    // src/app/login/login.page.ts

    this.authService.iniciarSesion(credenciales).subscribe({
      next: (respuestaServidor) => {
        console.log('Respuesta completa del servidor:', respuestaServidor);

        try {
          if (respuestaServidor && respuestaServidor.token) {
            // Guardamos el token primero (es lo más importante)
            localStorage.setItem('token', respuestaServidor.token);
            
            // Guardamos el usuario. Si da error por referencias circulares,
            // guardamos solo los datos básicos para que no falle.
            const datosUsuario = {
              id: respuestaServidor.usuario.id,
              nombre: respuestaServidor.usuario.nombre,
              apellidos: respuestaServidor.usuario.apellidos, // ¡Añadimos los apellidos!
              rol: respuestaServidor.usuario.rol,
              email: respuestaServidor.usuario.email,
              telefono: respuestaServidor.usuario.telefono  // ¡Añadimos el teléfono!
            };
            
            localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario));
            console.log('Datos guardados correctamente, navegando...');
            
            // Navegamos a la ruta de inicio
            this.router.navigate(['/inicio']);
          } else {
            this.mensajeError = 'Respuesta del servidor incompleta.';
          }
        } catch (e) {
          console.error('Error al procesar los datos de sesión:', e);
          this.mensajeError = 'Error interno al iniciar sesión.';
        }
      },
      error: (error) => {
        console.error('Error de red o credenciales:', error);
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}