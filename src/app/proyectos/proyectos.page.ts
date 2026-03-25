import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, 
  IonSelect, IonSelectOption, IonList, IonTextarea
} from '@ionic/angular/standalone'; 

import { addIcons } from 'ionicons';
import { addOutline, folderOutline, closeOutline, saveOutline, pencilOutline } from 'ionicons/icons';

// Importamos los servicios para traer la información
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
    IonButtons, IonMenuButton, IonButton, IonIcon, IonItem, IonLabel, 
    IonInput, IonSelect, IonSelectOption, IonList, IonTextarea
  ]
})
export class ProyectosPage implements OnInit {

  // Listas de datos
  proyectos: Proyecto[] = []; 
  clientes: Cliente[] = [];
  usuarios: any[] = [];

  // Control del formulario
  mostrandoFormulario = false;
  editando = false;

  // Objeto para guardar los datos del formulario
  proyectoForm: any = this.resetearFormulario();

  // Inyección de servicios
  private proyectoService = inject(ProyectoService);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);

  constructor() { 
    addIcons({ addOutline, folderOutline, closeOutline, saveOutline, pencilOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  // --- CARGA DE DATOS ---

  cargarDatos() {
    this.obtenerProyectos();
    this.obtenerClientes();
    this.obtenerUsuarios();
  }

  obtenerProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (datos) => this.proyectos = datos,
      error: (err) => console.error('Error al cargar proyectos:', err)
    });
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => this.clientes = datos,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (datos) => this.usuarios = datos,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // --- LÓGICA DEL FORMULARIO ---

  abrirFormularioCrear() {
    this.proyectoForm = this.resetearFormulario();
    this.editando = false;
    this.mostrandoFormulario = true;
  }

  abrirFormularioEditar(proyecto: any) {
    // Extraemos el ID del cliente si existe (para el selector)
    const clienteId = proyecto.cliente ? proyecto.cliente.id : null;
    
    // Extraemos los IDs de los usuarios vinculados para el selector múltiple
    const usuariosIds = proyecto.usuarios ? proyecto.usuarios.map((u: any) => u.id) : [];

    this.proyectoForm = { ...proyecto, clienteId, usuariosIds };
    this.editando = true;
    this.mostrandoFormulario = true;
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario() {
    return {
      nombre: '',
      codigo: '',
      descripcion: '',
      clienteId: null,
      usuariosIds: []
    };
  }

  guardarProyecto() {
    if (this.editando) {
      this.proyectoService.actualizarProyecto(this.proyectoForm.id, this.proyectoForm).subscribe({
        next: () => {
          this.obtenerProyectos(); // Recargamos la lista
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.proyectoService.crearProyecto(this.proyectoForm).subscribe({
        next: () => {
          this.obtenerProyectos();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }
}