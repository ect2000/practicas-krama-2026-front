import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Importamos todos los componentes de Ionic que necesitamos
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/angular/standalone';

// 2. Importamos las herramientas de iconos (usaremos el icono de un edificio/negocio)
import { addIcons } from 'ionicons';
import { addOutline, businessOutline } from 'ionicons/icons';

// 3. Importamos tu servicio de clientes (Asegúrate de que la ruta es correcta)
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  // Declaramos los componentes para que el HTML funcione sin errores
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonIcon]
})
export class ClientesPage implements OnInit {

  listaClientes: any[] = [];

  constructor(private clienteService: ClienteService) { 
    // Registramos los iconos de "Añadir" y de "Negocio/Edificio"
    addIcons({ addOutline, businessOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Llamamos a tu servicio para obtener los clientes
    // Nota: Si el método de tu servicio se llama distinto a "obtenerClientes()", cámbialo aquí
    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => {
        console.log('¡Éxito! Clientes recibidos:', datos);
        this.listaClientes = datos; 
      },
      error: (error) => {
        console.error('Error al traer los Clientes:', error);
      }
    });
  }
}