import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonInput, 
  IonSelect, IonSelectOption, IonList, IonTextarea
} from '@ionic/angular/standalone'; 

import { addIcons } from 'ionicons';
import { addOutline, folderOutline, closeOutline, saveOutline, pencilOutline } from 'ionicons/icons';
import { ProyectoService, Proyecto } from '../services/proyecto.service';
import { ClienteService, Cliente } from '../services/cliente.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonMenuButton, IonButton, IonIcon, IonItem, 
    IonInput, IonSelect, IonSelectOption, IonList, IonTextarea
  ]
})
export class ProyectosPage implements OnInit {
  proyectos: Proyecto[] = []; 
  clientes: Cliente[] = [];
  usuarios: any[] = [];
  mostrandoFormulario = false;
  editando = false;
  proyectoForm: any = this.resetearFormulario();

  private proyectoService = inject(ProyectoService);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);

  constructor() { 
    addIcons({ addOutline, folderOutline, closeOutline, saveOutline, pencilOutline });
  }

  ngOnInit() {
    this.obtenerProyectos();
    this.obtenerClientes();
    this.obtenerUsuarios();
  }

  obtenerProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({ next: (d) => this.proyectos = d });
  }
  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({ next: (d) => this.clientes = d });
  }
  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({ next: (d) => this.usuarios = d });
  }

  abrirFormularioCrear() {
    this.proyectoForm = this.resetearFormulario();
    this.editando = false;
    this.mostrandoFormulario = true;
  }

  abrirFormularioEditar(proyecto: any) {
    const clienteId = proyecto.cliente ? proyecto.cliente.id : null;
    const usuariosIds = proyecto.usuarios ? proyecto.usuarios.map((u: any) => u.id) : [];
    this.proyectoForm = { ...proyecto, clienteId, usuariosIds };
    this.editando = true;
    this.mostrandoFormulario = true;
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario() {
    return { nombre: '', codigo: '', descripcion: '', clienteId: null, usuariosIds: [] };
  }

  guardarProyecto() {
    const datosParaAPI = {
      id: this.proyectoForm.id,
      nombre: this.proyectoForm.nombre,
      codigo: this.proyectoForm.codigo,
      descripcion: this.proyectoForm.descripcion,
      cliente: this.proyectoForm.clienteId ? { id: this.proyectoForm.clienteId } : null,
      usuarios: this.proyectoForm.usuariosIds && this.proyectoForm.usuariosIds.length > 0 
                ? this.proyectoForm.usuariosIds.map((id: number) => ({ id: id })) 
                : []
    };

    if (this.editando) {
      this.proyectoService.actualizarProyecto(datosParaAPI.id, datosParaAPI).subscribe({
        next: () => { this.obtenerProyectos(); this.cerrarFormulario(); }
      });
    } else {
      this.proyectoService.crearProyecto(datosParaAPI).subscribe({
        next: () => { this.obtenerProyectos(); this.cerrarFormulario(); }
      });
    }
  }
}