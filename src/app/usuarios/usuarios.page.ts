import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // <-- 1. Importamos la herramienta para hacer peticiones
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonList, IonItem, IonLabel } from '@ionic/angular/standalone'; // <-- 2. Añadimos componentes de lista

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  // 3. ¡Importante! Declaramos los componentes de Ionic que vamos a usar en el HTML
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonList, IonItem, IonLabel]
})
export class UsuariosPage implements OnInit {

  // Aquí guardaremos los usuarios que nos devuelva el Backend
  usuarios: any[] = []; 
  
  // Inyectamos la herramienta HttpClient
  private http = inject(HttpClient); 

  constructor() { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    // 4. Hacemos la llamada GET a la ruta exacta de tu Spring Boot
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe({
      next: (datosDelBackend) => {
        console.log('¡Éxito! Datos recibidos:', datosDelBackend);
        this.usuarios = datosDelBackend; // Guardamos los datos para que el HTML los dibuje
      },
      error: (error) => {
        console.error('Ha habido un error de conexión:', error);
      }
    });
  }

}