import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Importamos IonList, IonItem e IonLabel para poder dibujar la lista en el HTML
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

// 2. Importamos el servicio y la interfaz que creaste antes
import { ClienteService, Cliente } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  // 3. Añadimos IonList, IonItem e IonLabel a los 'imports' para que la página sepa que existen
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonList, IonItem, IonLabel]
})
export class ClientesPage implements OnInit {
  
  // Aquí guardaremos la lista de clientes que recibamos del backend
  listaClientes: Cliente[] = [];

  // Inyectamos el servicio (nuestro mensajero)
  constructor(private clienteService: ClienteService) { }

  // Esta función se dispara nada más entrar en la página
  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Pedimos los datos y nos quedamos "escuchando" (subscribe) la respuesta
    this.clienteService.obtenerClientes().subscribe({
      next: (datosDelBackend) => {
        console.log('¡Éxito! Clientes recibidos:', datosDelBackend);
        // Guardamos los datos en nuestra variable
        this.listaClientes = datosDelBackend; 
      },
      error: (error) => {
        console.error('Error al traer los clientes:', error);
      }
    });
  }

}