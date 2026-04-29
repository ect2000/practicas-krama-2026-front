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
  usuariosAdmin: any[] = []; 

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

  /**
   * Obtiene la lista de proyectos y la guarda.
   */
  obtenerProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({ next: (d) => this.proyectos = d });
  }
  
  /**
   * Obtiene la lista de clientes para rellenar los selectores.
   */
  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe({ next: (d) => this.clientes = d });
  }

  /**
   * Obtiene la lista de usuarios y separa a los administradores para asignarlos como encargados.
   */
  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({ 
      next: (d) => { 
        this.usuarios = d; 
        this.usuariosAdmin = d.filter((u: any) => u.rol === 'ADMIN');
      } 
    });
  }

  /**
   * Resetea el formulario y abre el modal en modo creación.
   */
  abrirFormularioCrear() {
    this.proyectoForm = this.resetearFormulario();
    this.editando = false;
    this.isModalOpen = true;
  }

  /**
   * Configura el formulario con los datos de un proyecto para su edición.
   * @param proyecto Objeto con los datos a editar.
   */
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
      costeTotal: proyecto.costeTotal || null 
    }; 
    
    this.editando = true;
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal de formulario.
   */
  cerrarFormulario() {
    this.isModalOpen = false;
  }

  /**
   * Genera la estructura inicial de un formulario de proyecto.
   * @return Objeto con los campos vacíos de proyecto.
   */
  resetearFormulario() {
    return { 
      nombre: '', 
      codigo: '', 
      descripcion: '', 
      clienteId: null, 
      encargadoId: null, 
      usuariosIds: [],
      horasPresupuestadas: null,
      costeTotal: null
    };
  }

  // ---> NUEVA FUNCIÓN PARA FORMATEAR EL DINERO <---
  /**
   * Formatea un número como moneda (Euros).
   * @param valor Cantidad numérica.
   * @return String formateado (ej. "1.000 €").
   */
  formatearMoneda(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return 'Sin definir';
    }
    // Convierte el número aplicando el formato de España (punto para miles, coma para decimales)
    return Number(valor).toLocaleString('es-ES') + ' €';
  }

  /**
   * Recoge los datos del formulario, los estructura para la API, y hace la petición de crear o actualizar.
   */
  guardarProyecto() {
    const datosParaAPI = {
      id: this.proyectoForm.id,
      nombre: this.proyectoForm.nombre,
      codigo: this.proyectoForm.codigo,
      descripcion: this.proyectoForm.descripcion,
      horasPresupuestadas: this.proyectoForm.horasPresupuestadas, 
      costeTotal: this.proyectoForm.costeTotal,                 
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