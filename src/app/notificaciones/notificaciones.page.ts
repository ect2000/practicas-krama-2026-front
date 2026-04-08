import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { NotificacionService } from '../services/notificaciones.service';

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
  ) { }

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
    
    // 1. Cargar las notificaciones de las imputaciones ("Usuario X ha añadido 10 h...")
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (notasBackend) => {
        this.notificaciones.push(...notasBackend);
      },
      error: (err) => console.error('Error cargando notificaciones del server', err)
    });

    // 2. Cargar las alertas de presupuestos
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
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos para generar alertas', err);
        this.cargando = false;
      }
    });
  }
}