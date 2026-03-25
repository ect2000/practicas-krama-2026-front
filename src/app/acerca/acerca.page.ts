import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. AÑADIMOS IonList AQUÍ ARRIBA
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.page.html',
  styleUrls: ['./acerca.page.scss'],
  standalone: true,
  // 2. AÑADIMOS IonList AQUÍ ABAJO TAMBIÉN
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList]
})
export class AcercaPage implements OnInit {

  // Variable para guardar tus datos
  usuarioActual: any = null;

  constructor(private router: Router) { }

  ngOnInit() {
    // Al cargar la pantalla, leemos la memoria del teléfono
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      this.usuarioActual = JSON.parse(usuarioGuardado); // Transformamos el texto en un objeto
    }
  }

  cerrarSesion() {
    // 1. Borramos tus datos de la memoria
    localStorage.removeItem('usuarioLogueado');
    // 2. Viajamos de vuelta a la pantalla de login
    this.router.navigate(['/login']);
  }

}