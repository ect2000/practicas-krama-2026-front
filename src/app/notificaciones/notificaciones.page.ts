import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos todas las piezas visuales necesarias
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';

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

  constructor(private proyectoService: ProyectoService) { }

  // Se ejecuta cada vez que la pantalla se hace visible
  ionViewWillEnter() {
    this.verificarAjustes();
  }

  verificarAjustes() {
    const alertaGuardada = localStorage.getItem('alertaPresupuesto');
    // Si no hay nada guardado, asumimos true por defecto
    this.alertasActivas = alertaGuardada === null ? true : alertaGuardada === 'true';

    if (this.alertasActivas) {
      this.cargarAlertas();
    } else {
      this.cargando = false;
      this.notificaciones = []; // Limpiamos la lista si las apagó
    }
  }

  cargarAlertas() {
    this.cargando = true;
    
    // Llamamos a tu backend para traer los proyectos
    this.proyectoService.obtenerProyectos().subscribe({
      next: (proyectos) => {
        this.notificaciones = []; // Vaciamos la lista vieja
        
        proyectos.forEach((proyecto: any) => {
          // Extraemos las horas (Asegúrate de que estos nombres coinciden con tu backend)
          // Si tu backend usa otros nombres (ej. horas_estimadas), cámbialos aquí
          const horasEstimadas = proyecto.horasEstimadas || 100; 
          const horasImputadas = proyecto.horasImputadas || 0;
          
          if (horasEstimadas > 0) {
            const porcentaje = (horasImputadas / horasEstimadas) * 100;

            // Alerta ROJA: Se ha pasado del 100%
            if (porcentaje >= 100) {
              this.notificaciones.push({
                titulo: `¡Presupuesto superado!`,
                mensaje: `El proyecto "${proyecto.nombre}" ha consumido ${horasImputadas}h de las ${horasEstimadas}h estimadas.`,
                color: 'danger',
                icono: 'alert-circle'
              });
            } 
            // Alerta AMARILLA: Está al 80% o más
            else if (porcentaje >= 80) {
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