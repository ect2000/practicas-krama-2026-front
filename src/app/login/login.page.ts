import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // MUY IMPORTANTE para poder leer los inputs
// Mantén aquí todos los imports de Ionic que tenías en tu diseño original
import { IonicModule } from '@ionic/angular'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // Asegúrate de que FormsModule esté en esta lista de imports
  imports: [CommonModule, FormsModule, IonicModule] 
})
export class LoginPage implements OnInit {

  // Variables para guardar lo que el usuario escriba
  correo: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  hacerLogin() {
    const credenciales = {
      email: this.correo,
      password: this.contrasena
    };

    // Llamamos a nuestro backend
    this.authService.iniciarSesion(credenciales).subscribe({
      next: (usuario) => {
        console.log('¡Login correcto! Bienvenido:', usuario);
        
        // ---> AÑADE ESTA LÍNEA: Guarda el usuario en la memoria <---
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        
        // Si entra bien, lo mandamos a la página de inicio
        this.router.navigate(['/inicio']); 
      },
      error: (error) => {
        // ... (tu código de error)
      }
    });
  }
}