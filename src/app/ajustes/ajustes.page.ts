import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, 
  IonList, IonItem, IonLabel, IonToggle, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, 
  IonItemGroup, IonItemDivider,
  IonModal, IonInput, IonText, IonButton // <-- AÑADIDOS
} from '@ionic/angular/standalone';

import { UsuarioService } from '../services/usuario.service'; // <-- INYECTAMOS EL SERVICIO
import { addIcons } from 'ionicons';
import { lockClosedOutline, lockOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, 
    IonList, IonItem, IonLabel, IonToggle, RouterModule,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon,
    IonItemGroup, IonItemDivider,
    IonModal, IonInput, IonText, IonButton // <-- AÑADIDOS
  ]
})
export class AjustesPage implements OnInit {

  modoOscuro: boolean = false;
  alertaPresupuesto: boolean = true; 
  resumenSemanal: boolean = false;   

  // --- VARIABLES PARA EL MODAL DE CONTRASEÑA ---
  mostrandoModalPassword = false;
  nuevaPassword = '';
  repetirPassword = '';
  mensajeError = '';
  mensajeExito = '';

  constructor(private usuarioService: UsuarioService) { 
    addIcons({ lockClosedOutline, lockOpenOutline });
  }

  ngOnInit() {
    const temaGuardado = localStorage.getItem('modoOscuro');
    if (temaGuardado === 'true') {
      this.modoOscuro = true;
    }

    const alertaGuardada = localStorage.getItem('alertaPresupuesto');
    if (alertaGuardada !== null) {
      this.alertaPresupuesto = alertaGuardada === 'true';
    }

    const resumenGuardado = localStorage.getItem('resumenSemanal');
    if (resumenGuardado !== null) {
      this.resumenSemanal = resumenGuardado === 'true';
    }
  }

  cambiarTema() {
    if (this.modoOscuro) {
      document.documentElement.classList.add('ion-palette-dark');
      localStorage.setItem('modoOscuro', 'true');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
      localStorage.setItem('modoOscuro', 'false');
    }
  }

  guardarAlertas() {
    localStorage.setItem('alertaPresupuesto', this.alertaPresupuesto.toString());
    localStorage.setItem('resumenSemanal', this.resumenSemanal.toString());
  }

  // --- LÓGICA DEL MODAL DE CONTRASEÑA ---
  abrirModalPassword() {
    this.nuevaPassword = '';
    this.repetirPassword = '';
    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrandoModalPassword = true;
  }

  cerrarModalPassword() {
    this.mostrandoModalPassword = false;
  }

  guardarContrasena() {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.nuevaPassword || !this.repetirPassword) {
      this.mensajeError = 'Por favor, rellena ambos campos.';
      return;
    }

    if (this.nuevaPassword !== this.repetirPassword) {
      this.mensajeError = 'Las contraseñas no coinciden. Revisa lo que has escrito.';
      return;
    }

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioGuardado) {
      let usuario = JSON.parse(usuarioGuardado);
      usuario.password = this.nuevaPassword;

      this.usuarioService.actualizarUsuario(usuario.id, usuario).subscribe({
        next: (usuarioActualizado) => {
          this.mensajeExito = '¡Contraseña actualizada con éxito!';
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));
          
          // Cerramos el modal tras 1.5 segundos
          setTimeout(() => {
            this.cerrarModalPassword();
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