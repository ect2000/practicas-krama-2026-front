import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonInput, IonList, IonModal, IonTextarea 
} from '@ionic/angular/standalone'; 

import { addIcons } from 'ionicons';
import { addOutline, businessOutline, closeOutline, saveOutline, pencilOutline } from 'ionicons/icons';
import { ClienteService, Cliente } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonMenuButton, IonButton, IonIcon, IonItem, 
    IonInput, IonList, IonModal, IonTextarea
  ]
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = []; 
  
  isModalOpen = false;
  editando = false;
  
  clienteForm: any = this.resetearFormulario();

  private clienteService = inject(ClienteService);

  constructor() { 
    addIcons({ addOutline, businessOutline, closeOutline, saveOutline, pencilOutline });
  }

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({ next: (d) => this.clientes = d });
  }

  abrirFormularioCrear() {
    this.clienteForm = this.resetearFormulario();
    this.editando = false;
    this.isModalOpen = true; 
  }

  abrirFormularioEditar(cliente: Cliente) {
    this.clienteForm = { ...cliente };
    this.editando = true;
    this.isModalOpen = true; 
  }

  cerrarFormulario() {
    this.isModalOpen = false;
  }

  resetearFormulario() {
    // AÑADIMOS LA DESCRIPCIÓN AQUÍ
    return { nombre: '', descripcion: '' };
  }

  guardarCliente() {
    if (this.editando) {
      this.clienteService.actualizarCliente(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => { this.obtenerClientes(); this.cerrarFormulario(); }
      });
    } else {
      this.clienteService.crearCliente(this.clienteForm).subscribe({
        next: () => { this.obtenerClientes(); this.cerrarFormulario(); }
      });
    }
  }
}