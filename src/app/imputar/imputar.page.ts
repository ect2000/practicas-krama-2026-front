import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ImputacionService } from '../services/imputacion.service';
import { ProyectoService } from '../services/proyecto.service'; 
import { Imputacion } from '../models/imputacion.model';

@Component({
  selector: 'app-imputar',
  templateUrl: './imputar.page.html',
  styleUrls: ['./imputar.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class ImputarPage implements OnInit {

  nuevaImputacion: Imputacion = {
    proyecto: { id: 0 }, 
    usuario: { id: 0 }, 
    fecha: new Date().toISOString().split('T')[0], 
    horas: null as any, 
    anotaciones: ''
  };

  proyectoSeleccionadoId: number | null = null;
  esEdicion: boolean = false; 
  proyectos: any[] = []; 

  // NUEVAS VARIABLES PARA EL CONTROL DE HORAS
  horasTotalesDia: number = 0;
  imputacionesDelUsuario: Imputacion[] = [];

  constructor(
    private imputacionService: ImputacionService,
    private proyectoService: ProyectoService, 
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.comprobarSiEsEdicion();
    this.cargarProyectos(); 
    this.comprobarProyectoPreseleccionado(); 
    // Cargamos el historial de horas al iniciar
    this.cargarImputacionesUsuario();
  }

  cargarProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => this.proyectos = data,
      error: (error) => console.error('Error al cargar proyectos:', error)
    });
  }

  comprobarProyectoPreseleccionado() {
    this.route.queryParams.subscribe(params => {
      if (params['proyectoId']) {
        this.proyectoSeleccionadoId = Number(params['proyectoId']);
      }
    });
  }

  cargarUsuarioLogueado() {
    const usuarioObjetoGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioObjetoGuardado) {
      const usuarioParseado = JSON.parse(usuarioObjetoGuardado);
      this.nuevaImputacion.usuario.id = usuarioParseado.id;
    }
  }

  comprobarSiEsEdicion() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.nuevaImputacion.id = Number(idParam);
    }
  }

  // NUEVA FUNCIÓN: Descarga todas las imputaciones del usuario logueado
  cargarImputacionesUsuario() {
    if (this.nuevaImputacion.usuario.id && this.nuevaImputacion.usuario.id !== 0) {
      this.imputacionService.getImputacionesByUsuario(this.nuevaImputacion.usuario.id).subscribe({
        next: (data) => {
          this.imputacionesDelUsuario = data;
          // Calculamos las horas para el día actual por defecto
          this.calcularHorasDelDia();
        },
        error: (error) => console.error('Error al cargar imputaciones del usuario', error)
      });
    }
  }

  // NUEVA FUNCIÓN: Filtra y suma las horas del día seleccionado
  calcularHorasDelDia() {
    const fechaSeleccionada = this.nuevaImputacion.fecha;
    
    // Filtramos las imputaciones que coinciden con la fecha elegida
    const imputacionesHoy = this.imputacionesDelUsuario.filter(
      (imp) => imp.fecha === fechaSeleccionada && imp.id !== this.nuevaImputacion.id // Excluimos la actual si estamos editando
    );

    // Sumamos las horas de ese día
    this.horasTotalesDia = imputacionesHoy.reduce((total, imp) => total + imp.horas, 0);
  }

  guardarImputacion() {
    if (this.proyectoSeleccionadoId) {
      this.nuevaImputacion.proyecto.id = Number(this.proyectoSeleccionadoId);
    } else {
      this.nuevaImputacion.proyecto.id = 0; 
    }

    if (this.nuevaImputacion.usuario.id === 0) {
      alert('Error: No se ha detectado tu sesión de usuario.');
      return;
    }

    if (!this.nuevaImputacion.proyecto.id || this.nuevaImputacion.proyecto.id === 0) {
      alert('Por favor, selecciona un proyecto de la lista.');
      return;
    }

    if (this.nuevaImputacion.horas === null || this.nuevaImputacion.horas < 0) {
      alert('No puedes imputar una cantidad negativa de horas.');
      return;
    }

    if (this.nuevaImputacion.horas === 0) {
      alert('Por favor, introduce el número de horas dedicadas.');
      return;
    }

    // Opcional: Validar que no se pase de 24 horas al día
    if ((this.horasTotalesDia + this.nuevaImputacion.horas) > 24) {
      alert(`¡Cuidado! Ya tienes ${this.horasTotalesDia} horas registradas este día. El total superaría las 24 horas.`);
      return;
    }

    if (this.esEdicion && this.nuevaImputacion.id) {
      this.imputacionService.actualizarImputacion(this.nuevaImputacion.id, this.nuevaImputacion).subscribe({
        next: () => {
          alert('¡Horas actualizadas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: () => alert('Hubo un error al actualizar.')
      });
    } else {
      this.imputacionService.crearImputacion(this.nuevaImputacion).subscribe({
        next: () => {
          alert('¡Horas registradas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: (error) => {
          if (error.error && typeof error.error === 'string') {
            alert(error.error);
          } else {
            alert('Hubo un error al crear la imputación.');
          }
        }
      });
    }
  }
}