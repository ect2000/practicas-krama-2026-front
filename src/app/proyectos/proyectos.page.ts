import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonInput, 
  IonSelect, IonSelectOption, IonList, IonTextarea, IonModal
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
    IonInput, IonSelect, IonSelectOption, IonList, IonTextarea, IonModal
  ]
})
export class ProyectosPage implements OnInit {
  proyectos: Proyecto[] = []; 
  clientes: Cliente[] = [];
  usuarios: any[] = [];
  usuariosAdmin: any[] = []; // Sublista para los encargados (Solo Admins)

  isModalOpen = false;
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
    this.usuarioService.obtenerUsuarios().subscribe({ 
      next: (d) => { 
        this.usuarios = d; 
        // Filtramos para obtener solo los administradores para el campo de Encargado
        this.usuariosAdmin = d.filter((u: any) => u.rol === 'ADMIN');
      } 
    });
  }

  abrirFormularioCrear() {
    this.proyectoForm = this.resetearFormulario();
    this.editando = false;
    this.isModalOpen = true;
  }

  abrirFormularioEditar(proyecto: any) {
    const clienteId = proyecto.cliente ? proyecto.cliente.id : null;
    const encargadoId = proyecto.encargado ? proyecto.encargado.id : null; 
    const usuariosIds = proyecto.usuarios ? proyecto.usuarios.map((u: any) => u.id) : [];
    
    this.proyectoForm = { 
      ...proyecto, 
      clienteId, 
      encargadoId, 
      usuariosIds,
      horasPresupuestadas: proyecto.horasPresupuestadas || null,
      presupuesto: proyecto.costeTotal || null
    }; 
    
    this.editando = true;
    this.isModalOpen = true;
  }

  cerrarFormulario() {
    this.isModalOpen = false;
  }

  resetearFormulario() {
    return { 
      nombre: '', 
      codigo: '', 
      descripcion: '', 
      clienteId: null, 
      encargadoId: null, 
      usuariosIds: [],
      horasPresupuestadas: null,
      presupuesto: null
    };
  }

  guardarProyecto() {
    const datosParaAPI = {
      id: this.proyectoForm.id,
      nombre: this.proyectoForm.nombre,
      codigo: this.proyectoForm.codigo,
      descripcion: this.proyectoForm.descripcion,
      horasPresupuestadas: this.proyectoForm.horasPresupuestadas, 
      costeTotal: this.proyectoForm.presupuesto,                 
      cliente: this.proyectoForm.clienteId ? { id: this.proyectoForm.clienteId } : null,
      encargado: this.proyectoForm.encargadoId ? { id: this.proyectoForm.encargadoId } : null,
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