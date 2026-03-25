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
  usuarios: any[] = []; 
  clientes: Cliente[] = [];
  proyectos: Proyecto[] = [];
  proyectosVisibles: Proyecto[] = [];

  mostrandoFormulario = false;
  editando = false;
  usuarioForm: any = this.resetearFormulario();

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

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({ next: (d) => this.usuarios = d });
  }
  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({ next: (d) => this.clientes = d });
  }
  obtenerProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({ 
      next: (d) => { this.proyectos = d; this.proyectosVisibles = d; }
    });
  }

  abrirFormularioCrear() {
    this.usuarioForm = this.resetearFormulario();
    this.proyectosVisibles = [...this.proyectos];
    this.editando = false;
    this.mostrandoFormulario = true;
  }

  abrirFormularioEditar(usuario: any) {
    // Si tu backend funciona igual que en Proyectos, aquí mapeamos clientes y proyectos
    const clientesIds = usuario.clientes ? usuario.clientes.map((c: any) => c.id) : [];
    const proyectosIds = usuario.proyectos ? usuario.proyectos.map((p: any) => p.id) : [];

    this.usuarioForm = { ...usuario, clientesIds, proyectosIds };
    this.editando = true;
    this.mostrandoFormulario = true;
    this.alCambiarClientes();
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario() {
    return { nombre: '', apellidos: '', email: '', telefono: '', permisos: '', clientesIds: [], proyectosIds: [] };
  }

  alCambiarClientes() {
    const clientesSeleccionados = this.usuarioForm.clientesIds || [];
    if (clientesSeleccionados.length === 0) {
      this.proyectosVisibles = [...this.proyectos];
    } else {
      this.proyectosVisibles = this.proyectos.filter(proyecto => 
        proyecto.cliente && clientesSeleccionados.includes(proyecto.cliente.id)
      );
    }
    if (this.usuarioForm.proyectosIds) {
      this.usuarioForm.proyectosIds = this.usuarioForm.proyectosIds.filter((id: number) => 
        this.proyectosVisibles.some(pv => pv.id === id)
      );
    }
  }

  guardarUsuario() {
    // 1. Construimos el objeto EXACTO que espera el backend, 
    // sin enviar variables extra que el servidor no entienda.
    const datosParaAPI = {
      id: this.usuarioForm.id,
      nombre: this.usuarioForm.nombre,
      apellidos: this.usuarioForm.apellidos,
      email: this.usuarioForm.email,
      telefono: this.usuarioForm.telefono,
      permisos: this.usuarioForm.permisos,
      
      // 2. Añadimos un "|| []" de seguridad por si el usuario no selecciona nada, 
      // evitando que la función .map() rompa la página.
      clientes: (this.usuarioForm.clientesIds || []).map((id: number) => ({ id: id })),
      proyectos: (this.usuarioForm.proyectosIds || []).map((id: number) => ({ id: id }))
    };

    if (this.editando) {
      this.usuarioService.actualizarUsuario(datosParaAPI.id, datosParaAPI).subscribe({
        next: () => { 
          this.obtenerUsuarios(); 
          this.cerrarFormulario(); 
        },
        error: (err) => {
          console.error('Error del servidor al actualizar:', err);
          alert('No se pudo actualizar el usuario. Abre la consola (F12) para ver el error del servidor.');
        }
      });
    } else {
      this.usuarioService.crearUsuario(datosParaAPI).subscribe({
        next: () => { 
          this.obtenerUsuarios(); 
          this.cerrarFormulario(); 
        },
        error: (err) => {
          console.error('Error del servidor al crear:', err);
          alert('No se pudo guardar el usuario. Abre la consola (F12) para ver el error del servidor.');
        }
      });
    }
  }
}