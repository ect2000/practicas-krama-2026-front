import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    // 1. Extraemos los IDs de los MÚLTIPLES clientes
    const clientesIds = usuario.clientes ? usuario.clientes.map((c: any) => c.id) : [];
    const proyectosIds = usuario.proyectos ? usuario.proyectos.map((p: any) => p.id) : [];

    this.usuarioForm = { ...usuario, clientesIds, proyectosIds };
    this.editando = true;
    this.mostrandoFormulario = true;
    
    // Filtramos los proyectos para que coincidan con sus clientes
    this.alCambiarCliente();
  }

  cerrarFormulario() {
    this.mostrandoFormulario = false;
  }

  resetearFormulario() {
    // Cambiamos clienteId por clientesIds inicializado como un array vacío
    return { nombre: '', apellidos: '', email: '', telefono: '', rol: '', clientesIds: [], proyectosIds: [] };
  }

  // Ahora soporta múltiples clientes seleccionados
  alCambiarCliente() {
    const idsClientes = this.usuarioForm.clientesIds || [];
    
    if (idsClientes.length === 0) {
      this.proyectosVisibles = [...this.proyectos];
    } else {
      // Filtramos proyectos que pertenezcan a ALGUNO de los clientes seleccionados
      this.proyectosVisibles = this.proyectos.filter(proyecto => 
        proyecto.cliente && idsClientes.includes(proyecto.cliente.id)
      );
    }
    
    // Si algún proyecto seleccionado ya no pertenece a los clientes elegidos, lo quitamos
    if (this.usuarioForm.proyectosIds) {
      this.usuarioForm.proyectosIds = this.usuarioForm.proyectosIds.filter((id: number) => 
        this.proyectosVisibles.some(pv => pv.id === id)
      );
    }
  }

  guardarUsuario() {
    // Construimos el objeto para Spring Boot (Enviando una lista de clientes)
    const datosParaAPI = {
      id: this.usuarioForm.id,
      nombre: this.usuarioForm.nombre,
      apellidos: this.usuarioForm.apellidos,
      email: this.usuarioForm.email,
      telefono: this.usuarioForm.telefono,
      rol: this.usuarioForm.rol, 
      
      // Enviamos el array de clientes en formato [{id: 1}, {id: 2}]
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
          alert('No se pudo actualizar el usuario.');
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
          alert('No se pudo guardar el usuario.');
        }
      });
    }
  }
}