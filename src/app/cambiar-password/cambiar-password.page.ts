import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos el IonBackButton para poder volver atrás fácilmente
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonButton, IonText } from '@ionic/angular/standalone';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonItem, IonInput, IonButton, IonText]
})
export class CambiarPasswordPage implements OnInit {

  nuevaPassword = '';
  repetirPassword = '';
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  guardarContrasena() {
    this.mensajeError = '';
    this.mensajeExito = '';

    // 1. Comprobamos que no estén vacíos
    if (!this.nuevaPassword || !this.repetirPassword) {
      this.mensajeError = 'Por favor, rellena ambos campos.';
      return;
    }

    // 2. Comprobamos que sean idénticas
    if (this.nuevaPassword !== this.repetirPassword) {
      this.mensajeError = 'Las contraseñas no coinciden. Revisa lo que has escrito.';
      return;
    }

    // 3. Rescatamos tus datos de la memoria
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioGuardado) {
      let usuario = JSON.parse(usuarioGuardado);
      // Le cambiamos la contraseña antigua por la nueva
      usuario.password = this.nuevaPassword;

      // 4. Mandamos el paquete al backend
      this.usuarioService.actualizarUsuario(usuario.id, usuario).subscribe({
        next: (usuarioActualizado) => {
          this.mensajeExito = '¡Contraseña actualizada con éxito!';
          // Actualizamos también la memoria del navegador por si acaso
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));
          
          // Esperamos 1 segundo y medio para que el usuario lea el éxito y lo devolvemos a Ajustes
          setTimeout(() => {
            this.router.navigate(['/ajustes']);
          }, 1500);
        },
        error: (err) => {
          this.mensajeError = 'Error al conectar con el servidor.';
          console.error(err);
        }
      });
    } else {
      this.mensajeError = 'No se encontró tu sesión. Vuelve a iniciar sesión.';
    }
  }
}