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

  // Variables para guardar lo que el usuario escriba
  correo: string = '';
  contrasena: string = '';
  
  // NUEVO: Variable para almacenar el mensaje de error
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  hacerLogin() {
    // 1. Limpiamos cualquier error previo cada vez que se intenta iniciar sesión
    this.mensajeError = '';

    // 2. Comprobamos si alguno de los campos está vacío
    if (!this.correo || this.correo.trim() === '' || !this.contrasena || this.contrasena.trim() === '') {
      this.mensajeError = 'Por favor, rellena todos los campos antes de continuar.';
      return; // Detenemos la ejecución aquí para no hacer la petición al backend
    }

    const credenciales = {
      email: this.correo,
      password: this.contrasena
    };

    // Llamamos a nuestro backend
    this.authService.iniciarSesion(credenciales).subscribe({
      next: (usuario) => {
        console.log('¡Login correcto! Bienvenido:', usuario);
        
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        
        // Si entra bien, lo mandamos a la página de inicio
        this.router.navigate(['/inicio']); 
      },
      error: (error) => {
        // 3. Si el backend devuelve un error (ej. contraseña incorrecta)
        console.error('Error al iniciar sesión:', error);
        this.mensajeError = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    });
  }
}