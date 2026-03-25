import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// 1. Añadimos IonButton e IonIcon a la lista de componentes de Ionic
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone'; 

// 2. Importamos la función para añadir iconos y los iconos específicos que usamos en tu HTML
import { addIcons } from 'ionicons';
import { addOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  // 3. Declaramos IonButton e IonIcon para que Angular deje de dar error en el HTML
  // (También he limpiado IonList, IonItem e IonLabel porque ya no los usamos en el nuevo diseño)
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonIcon]
})
export class UsuariosPage implements OnInit {

  usuarios: any[] = []; 
  private http = inject(HttpClient); 

  constructor() { 
    // 4. Registramos los iconos para que se dibujen en la pantalla
    addIcons({ addOutline, peopleOutline });
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe({
      next: (datosDelBackend) => {
        console.log('¡Éxito! Datos recibidos:', datosDelBackend);
        this.usuarios = datosDelBackend; 
      },
      error: (error) => {
        console.error('Ha habido un error de conexión:', error);
      }
    });
  }
}