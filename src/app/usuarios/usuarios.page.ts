import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, 
  IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, 
  IonSelect, IonSelectOption, IonList 
} from '@ionic/angular/standalone'; 

import { addIcons } from 'ionicons';
import { addOutline, peopleOutline, closeOutline, saveOutline, pencilOutline } from 'ionicons/icons';

// Importamos los servicios necesarios
import { UsuarioService } from '../services/usuario.service';
import { ClienteService, Cliente } from '../services/cliente.service';
import { ProyectoService, Proyecto } from '../services/proyecto.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonMenuButton, IonButton, IonIcon, IonItem, IonLabel, 
    IonInput, IonSelect, IonSelectOption, IonList
  ]
})
export class UsuariosPage implements OnInit {

  // Listas de datos
  usuarios: any[] = []; 
  clientes: Cliente[] = [];
  proyectos: Proyecto[] = [];
  proyectosVisibles: Proyecto[] = []; // Proyectos que se mostrarán en el desplegable

  // Control del formulario
  mostrandoFormulario = false;
  editando = false; // Nos dirá si estamos creando o editando

  // Objeto donde guardaremos los datos del formulario
  usuarioForm: any = this.resetearFormulario();

  // Inyección de dependencias
  private usuarioService = inject(UsuarioService);
  private clienteService = inject(ClienteService);
  private proyectoService = inject(ProyectoService);

  constructor() { 
    addIcons({ addOutline, peopleOutline, closeOutline, saveOutline, pencilOutline });
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerClientes();
    this.obtenerProyectos();
  }

  // --- OBTENCIÓN DE DATOS ---

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (datos) => this.usuarios = datos,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => this.clientes = datos,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  obtenerProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (datos) => {
        this.proyectos = datos;
        this.proyectosVisibles = datos; // Por defecto mostramos todos
      },
      error: (err) => console.error('Error al cargar proyectos:', err)
    });
  }

  // --- LÓGICA DEL FORMULARIO ---

  abrirFormularioCrear() {
    this.usuarioForm = this.resetearFormulario();
    this.proyectosVisibles = [...this.proyectos];
    this.editando = false;
    this.mostrandoFormulario = true;
  }

  abrirFormularioEditar(usuario: any) {
    // Clonamos los datos del usuario para no modificar la lista directamente hasta guardar
    this.usuarioForm = { ...usuario };
    this.editando = true;
    this.mostrandoFormulario = true;
    this.alCambiarClientes(); // Filtramos los proyectos al editar según sus clientes
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario() {
    return {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      permisos: '',
      clientesIds: [],
      proyectosIds: []
    };
  }

  // Esta función se ejecuta cada vez que el usuario selecciona o quita un cliente
  alCambiarClientes() {
    const clientesSeleccionados = this.usuarioForm.clientesIds || [];

    // Si no hay clientes seleccionados, mostramos todos los proyectos
    if (clientesSeleccionados.length === 0) {
      this.proyectosVisibles = [...this.proyectos];
    } else {
      // Filtramos proyectos que pertenezcan a los clientes seleccionados
      this.proyectosVisibles = this.proyectos.filter(proyecto => 
        proyecto.cliente && clientesSeleccionados.includes(proyecto.cliente.id)
      );
    }

    // Limpiamos los proyectos que estaban seleccionados pero ya no son visibles
    if (this.usuarioForm.proyectosIds) {
      this.usuarioForm.proyectosIds = this.usuarioForm.proyectosIds.filter((id: number) => 
        this.proyectosVisibles.some(pv => pv.id === id)
      );
    }
  }

  guardarUsuario() {
    if (this.editando) {
      this.usuarioService.actualizarUsuario(this.usuarioForm.id, this.usuarioForm).subscribe({
        next: () => {
          this.obtenerUsuarios(); // Recargamos la lista
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.usuarioService.crearUsuario(this.usuarioForm).subscribe({
        next: () => {
          this.obtenerUsuarios();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }
}