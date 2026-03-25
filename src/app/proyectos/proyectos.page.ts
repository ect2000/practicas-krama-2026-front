import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Añadimos IonButton e IonIcon
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/angular/standalone';

// 2. Importamos las herramientas de iconos
import { addIcons } from 'ionicons';
import { addOutline, folderOpenOutline } from 'ionicons/icons';

import { ProyectoService, Proyecto } from '../services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
  standalone: true,
  // 3. Declaramos IonButton e IonIcon
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonIcon]
})
export class ProyectosPage implements OnInit {

  listaProyectos: Proyecto[] = [];

  constructor(private proyectoService: ProyectoService) { 
    // 4. Registramos los iconos
    addIcons({ addOutline, folderOpenOutline });
  }
  
  ngOnInit() {
    this.cargarDatos();
  }
  
  cargarDatos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (datos) => {
        console.log('¡Éxito! Proyectos recibidos:', datos);
        this.listaProyectos = datos; 
      },
      error: (error) => {
        console.error('Error al traer los Proyectos:', error);
      }
    });
  }
}