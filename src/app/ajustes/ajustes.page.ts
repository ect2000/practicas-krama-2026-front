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

  modoOscuro: boolean = false;
  
  // 1. NUEVAS VARIABLES PARA LAS ALERTAS
  alertaPresupuesto: boolean = true; // Por defecto encendida
  resumenSemanal: boolean = false;   // Por defecto apagada

  constructor() { }

  ngOnInit() {
    // Leer preferencias de modo oscuro
    const temaGuardado = localStorage.getItem('modoOscuro');
    if (temaGuardado === 'true') {
      this.modoOscuro = true;
    }

    // 2. LEER PREFERENCIAS DE ALERTAS AL INICIAR
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

  // 3. NUEVA FUNCIÓN PARA GUARDAR CUANDO TOQUES LOS INTERRUPTORES
  guardarAlertas() {
    localStorage.setItem('alertaPresupuesto', this.alertaPresupuesto.toString());
    localStorage.setItem('resumenSemanal', this.resumenSemanal.toString());
  }

}