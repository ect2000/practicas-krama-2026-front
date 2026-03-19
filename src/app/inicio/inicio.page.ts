import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular/standalone';

// Importamos iconos modernos de Ionic (Añadimos folderOpenOutline para el mensaje de vacío)
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, addOutline, saveOutline, calendarClearOutline, folderOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonCardContent]
})
export class InicioPage implements OnInit {

  // Variables para controlar la interfaz
  vistaActual: string = 'dia'; 
  fechaActual: string = 'Jueves, 19 Mar 2026'; 

  // ¡Ahora el arreglo empieza totalmente vacío, esperando a la base de datos!
  proyectosVinculados: any[] = [];

  constructor() { 
    // Registramos los iconos
    addIcons({ chevronBackOutline, chevronForwardOutline, addOutline, saveOutline, calendarClearOutline, folderOpenOutline });
  }

  ngOnInit() {
  }

}