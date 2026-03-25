import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel} from '@ionic/angular/standalone';

import { ProyectoService, Proyecto } from '../services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonMenuButton, IonList, IonLabel, IonItem]
})
export class ProyectosPage implements OnInit {

  listaProyectos: Proyecto[] = [];

  // Inyectamos el servicio (nuestro mensajero)
    constructor(private proyectoService: ProyectoService) { }
  
    // Esta función se dispara nada más entrar en la página
    ngOnInit() {
      this.cargarDatos();
    }
  
    cargarDatos() {
      // Pedimos los datos y nos quedamos "escuchando" (subscribe) la respuesta
      this.proyectoService.obtenerProyectos().subscribe({
        next: (datos) => {
          console.log('¡Éxito! Proyectos recibidos:', datos);
          // Guardamos los datos en nuestra variable
          this.listaProyectos = datos; 
        },
        error: (error) => {
          console.error('Error al traer los Proyectos:', error);
        }
      });
    }

}
