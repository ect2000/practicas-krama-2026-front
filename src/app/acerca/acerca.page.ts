import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.page.html',
  styleUrls: ['./acerca.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList]
})
export class AcercaPage implements OnInit {

  // Variable para guardar tus datos
  usuarioActual: any = null;
  
  // Nuevas variables para el perfil
  inicialUsuario: string = '';
  colorFondoPerfil: string = '#3B82F6'; // Color base por defecto

  constructor(private router: Router) { }

  ngOnInit() {
    // Al cargar la pantalla, leemos la memoria del teléfono
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      this.usuarioActual = JSON.parse(usuarioGuardado); // Transformamos el texto en un objeto
      
      // Llamamos a nuestra nueva función para preparar la foto de perfil
      this.prepararIconoPerfil();
    }
  }

  prepararIconoPerfil() {
    // Comprobamos que el usuario tiene un nombre definido
    if (this.usuarioActual && this.usuarioActual.nombre) {
      // Obtenemos la primera letra (índice 0)
      this.inicialUsuario = this.usuarioActual.nombre.charAt(0);
      // Asignamos un color al azar
      this.colorFondoPerfil = this.generarColorAleatorio();
    }
  }

  generarColorAleatorio(): string {
    // Lista de colores bonitos para el fondo (Estilo Tailwind)
    const colores = [
      '#EF4444', // Rojo
      '#F97316', // Naranja
      '#F59E0B', // Ámbar
      '#10B981', // Esmeralda
      '#06B6D4', // Cian
      '#3B82F6', // Azul
      '#8B5CF6', // Violeta
      '#EC4899'  // Rosa
    ];
    
    // Generamos un número aleatorio entre 0 y la cantidad de colores
    const indiceAleatorio = Math.floor(Math.random() * colores.length);
    return colores[indiceAleatorio];
  }

  cerrarSesion() {
    // 1. Borramos tus datos de la memoria
    localStorage.removeItem('usuarioLogueado');
    // 2. Viajamos de vuelta a la pantalla de login
    this.router.navigate(['/login']);
  }

}