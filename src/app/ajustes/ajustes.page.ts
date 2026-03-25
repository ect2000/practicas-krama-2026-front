import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos las piezas visuales necesarias
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonListHeader, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  // 2. AÑADIMOS RouterModule AL FINAL DE ESTA LISTA
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonList, IonListHeader, IonItem, IonLabel, IonToggle, RouterModule]
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