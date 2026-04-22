import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { NotificacionService } from '../services/notificaciones.service';
import { addIcons } from 'ionicons';
import { notificationsOffOutline, syncOutline, checkmarkCircle, alertCircle, warning, timeOutline } from 'ionicons/icons';

// Aquí están las dos importaciones necesarias que solucionan el error:

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonIcon, IonLabel, IonButton, RouterModule]
})
export class NotificacionesPage {

  alertasActivas: boolean = false;
  notificaciones: any[] = [];
  cargando: boolean = true;

  // Declaramos los servicios para poder usarlos
  constructor(
    private proyectoService: ProyectoService,
    private notificacionService: NotificacionService 
  ) { 
    // Registramos los iconos que usamos en esta pantalla
    addIcons({
      'notifications-off-outline': notificationsOffOutline,
      'sync-outline': syncOutline,
      'checkmark-circle': checkmarkCircle,
      'alert-circle': alertCircle,
      'warning': warning,
      'time-outline': timeOutline
    });
  }

  ionViewWillEnter() {
    this.verificarAjustes();
  }

  verificarAjustes() {
    const alertaGuardada = localStorage.getItem('alertaPresupuesto');
    this.alertasActivas = alertaGuardada === null ? true : alertaGuardada === 'true';

    if (this.alertasActivas) {
      this.cargarAlertas();
    } else {
      this.cargando = false;
      this.notificaciones = [];
    }
  }

  cargarAlertas() {
    this.cargando = true;
    this.notificaciones = []; 
    
    // 1. SOLUCIÓN: Usamos exactamente el mismo nombre que en el Login
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioGuardado) {
      // 2. SOLUCIÓN: Como guardamos directamente el usuario, el ID está en la raíz
      const usuarioObj = JSON.parse(usuarioGuardado);
      const usuarioId = usuarioObj.id; 

      if (usuarioId) {
        this.notificacionService.obtenerNotificaciones(usuarioId).subscribe({
          next: (notasBackend) => {
            this.notificaciones.push(...notasBackend);
            // IMPORTANTE: Cuando termina de cargar las del servidor, quitamos el spinner
            this.cargando = false; 
          },
          error: (err) => {
            console.error('Error cargando notificaciones del server', err);
            this.cargando = false;
          }
        });
      }
    } else {
      console.warn("No se encontró la sesión activa del usuario.");
      this.cargando = false;
    }

    // 3. Cargar las alertas de presupuestos (Mantenemos tu lógica actual)
    this.proyectoService.obtenerProyectos().subscribe({
      next: (proyectos) => {
        proyectos.forEach((proyecto: any) => {
          const horasEstimadas = proyecto.horasEstimadas || 100; 
          const horasImputadas = proyecto.horasImputadas || 0;
          
          if (horasEstimadas > 0) {
            const porcentaje = (horasImputadas / horasEstimadas) * 100;

            if (porcentaje >= 100) {
              this.notificaciones.push({
                titulo: `¡Presupuesto superado!`,
                mensaje: `El proyecto "${proyecto.nombre}" ha consumido ${horasImputadas}h de las ${horasEstimadas}h estimadas.`,
                color: 'danger',
                icono: 'alert-circle'
              });
            } else if (porcentaje >= 80) {
              this.notificaciones.push({
                titulo: `Aviso de límite de horas`,
                mensaje: `El proyecto "${proyecto.nombre}" está al ${porcentaje.toFixed(0)}%. Quedan ${horasEstimadas - horasImputadas}h disponibles.`,
                color: 'warning',
                icono: 'warning'
              });
            }
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar proyectos para generar alertas', err);
      }
    });
  }
}