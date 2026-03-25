// src/app/ajustes/ajustes.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Asegura RouterModule

//
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, 
  IonList, IonItem, IonLabel, IonToggle, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, 
  IonItemGroup, IonItemDivider 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  //
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, 
    IonList, IonItem, IonLabel, IonToggle, RouterModule,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon,
    IonItemGroup, IonItemDivider
  ]
})
export class AjustesPage implements OnInit {

  // Variable unida al interruptor de la pantalla
  modoOscuro: boolean = false;

  constructor() { }

  ngOnInit() {
    // Al abrir la pantalla de ajustes, comprobamos cómo estaba el interruptor
    const temaGuardado = localStorage.getItem('modoOscuro');
    if (temaGuardado === 'true') {
      this.modoOscuro = true;
    }
  }

  cambiarTema() {
    console.log('Botón pulsado. Modo oscuro está:', this.modoOscuro); // <--- AÑADE ESTO

    if (this.modoOscuro) {
      document.documentElement.classList.add('ion-palette-dark');
      localStorage.setItem('modoOscuro', 'true');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
      localStorage.setItem('modoOscuro', 'false');
    }
  }

}