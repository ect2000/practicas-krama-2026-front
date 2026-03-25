import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonInput, 
  IonList, IonTextarea
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
    IonInput, IonList, IonTextarea
  ]
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = [];
  mostrandoFormulario = false;
  editando = false;
  clienteForm: Cliente = this.resetearFormulario();

  private clienteService = inject(ClienteService);

  constructor() { 
    addIcons({ addOutline, businessOutline, closeOutline, saveOutline, pencilOutline });
  }

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => this.clientes = datos,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  abrirFormularioCrear() {
    this.clienteForm = this.resetearFormulario();
    this.editando = false;
    this.mostrandoFormulario = true;
  }

  abrirFormularioEditar(cliente: Cliente) {
    this.clienteForm = { ...cliente };
    this.editando = true;
    this.mostrandoFormulario = true;
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario(): Cliente {
    return { nombre: '', codigo: '', descripcion: '' };
  }

  guardarCliente() {
    if (this.editando && this.clienteForm.id) {
      this.clienteService.actualizarCliente(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al actualizar cliente:', err)
      });
    } else {
      this.clienteService.crearCliente(this.clienteForm).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al crear cliente:', err)
      });
    }
  }
}